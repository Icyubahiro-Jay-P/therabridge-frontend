import axios, { type InternalAxiosRequestConfig } from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "")

// Auth is carried exclusively by httpOnly cookies (set by the backend on
// login/register/refresh). The access token is never written to localStorage
// or held in JS memory, so it is out of reach of injected scripts.

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // increased timeout for slower backend operations like email/password reset
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// ====================== AUTH / REFRESH TOKEN PLUMBING ======================
let onAuthExpired: (() => void) | null = null

export function setAuthHandlers(handlers: {
  onAuthExpired?: () => void
}) {
  onAuthExpired = handlers.onAuthExpired ?? null
}

type RefreshResult =
  { ok: true } | { ok: false; reason: "expired" | "network" }

let refreshPromise: Promise<RefreshResult> | null = null

function performRefresh(): Promise<RefreshResult> {
  // Use a bare axios call (not `api`) so this never recurses into interceptors.
  // The server rotates the refresh cookie and sets a fresh access-token cookie;
  // nothing token-related is stored client-side.
  return axios
    .post<{ token: string }>(`${API_BASE_URL}/api/users/refresh`, {}, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      timeout: 15000,
    })
    .then((): RefreshResult => ({ ok: true }))
    .catch((err): RefreshResult => {
      if (!err?.response) {
        // Transient network failure - keep the session, surface a network error
        return { ok: false, reason: "network" }
      }
      const status = err.response.status
      // Transient proxy/server errors - e.g. Render returning 502/503 while the
      // backend is mid-deploy - must NOT log the user out. Only a genuine auth
      // failure (401/403) means the session has actually expired.
      if (status === 408 || status === 429 || status >= 500) {
        return { ok: false, reason: "network" }
      }
      onAuthExpired?.()
      return { ok: false, reason: "expired" }
    })
}

function getRefreshPromise(): Promise<RefreshResult> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NetworkError"
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(
        new NetworkError("Network error. Check your connection.")
      )
    }

    const status = error.response.status

    // Transient proxy/server errors (backend mid-deploy, rate limit, timeout)
    // are treated as network errors - never as a session expiry or confusing
    // backend error text.
    if (status === 408 || status === 429 || status >= 500) {
      return Promise.reject(
        new NetworkError("Network error. Check your connection.")
      )
    }

    const config = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined
    const url = config?.url ?? ""

    // On an expired access token, silently refresh and retry the original request.
    // Auth endpoints (login/register/refresh) are excluded to avoid loops.
    if (
      status === 401 &&
      !/\/api\/users\/(login|register|refresh)$/.test(url) &&
      config &&
      !config._retry
    ) {
      config._retry = true
      const result = await getRefreshPromise()
      if (result.ok) {
        // The refresh endpoint has already rotated the cookies; retry the
        // original request with the new (cookie-carried) credentials.
        return api(config)
      }
      if (result.reason === "expired") {
        return Promise.reject(
          new AuthError("Your session has expired. Please log in again.")
        )
      }
      return Promise.reject(
        new NetworkError("Network error. Check your connection.")
      )
    }

    const errData = error.response?.data
    const serverMessage =
      (typeof errData?.message === "string" ? errData.message : null) ||
      (typeof errData?.error?.message === "string"
        ? errData.error.message
        : null) ||
      (typeof errData?.error === "string" ? errData.error : null) ||
      error.message ||
      "Something went wrong"

    if (status === 401) {
      return Promise.reject(new AuthError(serverMessage))
    }
    if (status === 400 || status === 409) {
      return Promise.reject(new ValidationError(serverMessage))
    }

    return Promise.reject(new Error(serverMessage))
  }
)
