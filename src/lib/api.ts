import axios, { type InternalAxiosRequestConfig } from "axios"
import {
  AppClientError,
  AuthError,
  EXPECTED_OUTCOME_CODES,
  ExpectedOutcomeError,
  LIMIT_CODES,
  LimitError,
  NetworkError,
  ValidationError,
} from "@/lib/errors"

// Re-exported so existing `import { AuthError } from "@/lib/api"` call sites
// keep working; the canonical home is @/lib/errors.
export { AuthError, NetworkError, ValidationError, ExpectedOutcomeError, LimitError }
export type { ErrorSeverity } from "@/lib/errors"

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
    // are treated as retryable failures - never as a session expiry or confusing
    // backend error text.
    if (status === 408) {
      return Promise.reject(
        new NetworkError("The request timed out. Please try again.")
      )
    }
    if (status === 429) {
      return Promise.reject(
        new NetworkError("Too many requests. Please slow down and try again.")
      )
    }
    if (status >= 500) {
      return Promise.reject(
        new NetworkError("Server error. Please try again in a moment.")
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
      !/\/api\/users\/(login|register|refresh|verify-email|resend-verification)$/.test(url) &&
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

    // Canonical server payload: { error: { message, code, category, requestId } }
    // with legacy fallbacks for older response shapes.
    const errData = error.response?.data
    const serverMessage =
      (typeof errData?.error?.message === "string"
        ? errData.error.message
        : null) ||
      (typeof errData?.message === "string" ? errData.message : null) ||
      (typeof errData?.error === "string" ? errData.error : null) ||
      error.message ||
      "Something went wrong"
    const serverCode =
      typeof errData?.error?.code === "string" ? errData.error.code : undefined
    const serverCategory =
      errData?.error?.category === "SERVER" || errData?.error?.category === "USER"
        ? (errData.error.category as "SERVER" | "USER")
        : status >= 500
          ? ("SERVER" as const)
          : ("USER" as const)
    const requestId =
      typeof errData?.error?.requestId === "string" ? errData.error.requestId : undefined

    if (status === 401) {
      return Promise.reject(
        new AuthError(serverMessage, { code: serverCode, status, category: serverCategory, requestId })
      )
    }

    // Expected outcomes and reached limits are not failures - present them
    // gently instead of as red errors.
    if (serverCode && EXPECTED_OUTCOME_CODES.has(serverCode)) {
      return Promise.reject(
        new ExpectedOutcomeError(serverMessage, { code: serverCode, status, category: "USER", requestId })
      )
    }
    if (
      (serverCode && LIMIT_CODES.has(serverCode)) ||
      (status === 429 && !serverCode)
    ) {
      return Promise.reject(
        new LimitError(serverMessage, { code: serverCode ?? "RATE_LIMITED", status, category: "USER", requestId })
      )
    }

    if (status >= 500) {
      return Promise.reject(
        new NetworkError(serverMessage, { code: serverCode ?? "SERVER_ERROR", status, category: "SERVER", severity: "error", requestId })
      )
    }
    if (status === 400 || status === 409 || status === 403 || status === 404) {
      return Promise.reject(
        new ValidationError(serverMessage, { code: serverCode, status, category: serverCategory, requestId })
      )
    }

    return Promise.reject(
      new AppClientError({ message: serverMessage, code: serverCode, status, category: serverCategory, requestId })
    )
  }
)
