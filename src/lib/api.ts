import axios, { type InternalAxiosRequestConfig } from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && import.meta.env.DEV
    ? window.location.origin
    : "https://therabridge-backend.onrender.com")

export function setAuthToken(_token: string | null) {
  // Token is managed via Zustand persist (auth-store) and httpOnly cookies.
  // This function is kept for backward compatibility but is now a no-op.
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem("auth-storage")
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.state?.token ?? null
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // increased timeout for slower backend operations like email/password reset
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ====================== AUTH / REFRESH TOKEN PLUMBING ======================
let onTokenRefreshed: ((token: string) => void) | null = null
let onAuthExpired: (() => void) | null = null

export function setAuthHandlers(handlers: {
  onTokenRefreshed?: (token: string) => void
  onAuthExpired?: () => void
}) {
  onTokenRefreshed = handlers.onTokenRefreshed ?? null
  onAuthExpired = handlers.onAuthExpired ?? null
}

type RefreshResult =
  { ok: true; token: string } | { ok: false; reason: "expired" | "network" }

let refreshPromise: Promise<RefreshResult> | null = null

function performRefresh(): Promise<RefreshResult> {
  // Use a bare axios call (not `api`) so this never recurses into interceptors
  return axios
    .post<{ token: string }>(`${API_BASE_URL}/api/users/refresh`, null, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      timeout: 15000,
    })
    .then(({ data }): RefreshResult => {
      setAuthToken(data.token)
      onTokenRefreshed?.(data.token)
      return { ok: true, token: data.token }
    })
    .catch((err): RefreshResult => {
      if (!err?.response) {
        // Transient network failure — keep the session, surface a network error
        return { ok: false, reason: "network" }
      }
      setAuthToken(null)
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
    const config = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
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
        config.headers.Authorization = `Bearer ${result.token}`
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
