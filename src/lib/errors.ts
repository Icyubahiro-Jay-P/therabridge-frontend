// ============================================================================
// ERROR TAXONOMY (frontend)
//
// Two audiences, gated by VITE_NODE_ENV (mirrors the backend NODE_ENV):
//
//   USER errors  - the user did something through normal app use and needs to
//                  know the outcome. The server authors these messages for
//                  humans; show them verbatim, in any environment.
//
//   SERVER errors- something broke that the user cannot fix or understand.
//                  In production users get a calm generic message; in
//                  development the raw detail is surfaced for debugging.
//
// Severity tells the UI how to present a message:
//   error   - red banner: a true failure the user must know about.
//   warning - amber: a constraint was hit (limit, rate limit) but nothing broke.
//   info    - neutral/blue: an expected outcome worth noting ("already done").
//   success - green: everything worked.
// ============================================================================

const rawEnv = import.meta.env.VITE_NODE_ENV
export const APP_ENV: "development" | "production" | "test" =
  rawEnv === "production" || rawEnv === "test" ? rawEnv : "development"

/** True when the app runs for developers (verbose error reporting). */
export const IS_DEV = APP_ENV === "development"

export type ErrorSeverity = "error" | "warning" | "info" | "success"
export type ErrorCategory = "USER" | "SERVER"

const GENERIC_SERVER_MESSAGE =
  "Something went wrong on our end. Please try again in a moment."

interface AppClientErrorOptions {
  message: string
  code?: string
  status?: number
  category?: ErrorCategory
  severity?: ErrorSeverity
  requestId?: string
}

export class AppClientError extends Error {
  /** Machine-readable server code (e.g. EDIT_LIMIT_REACHED). */
  code?: string
  status?: number
  category: ErrorCategory
  severity: ErrorSeverity
  requestId?: string

  constructor(opts: AppClientErrorOptions) {
    super(opts.message)
    this.name = new.target.name
    this.code = opts.code
    this.status = opts.status
    this.category = opts.category ?? (opts.status && opts.status >= 500 ? "SERVER" : "USER")
    this.severity = opts.severity ?? (this.category === "SERVER" ? "error" : "error")
    this.requestId = opts.requestId
  }
}

/** Session expired or not logged in. */
export class AuthError extends AppClientError {
  constructor(message: string, opts: Partial<AppClientErrorOptions> = {}) {
    super({ ...opts, message, category: "USER", severity: "error" })
  }
}

/** Connectivity / timeout / rate-limit / transient backend issues. */
export class NetworkError extends AppClientError {
  constructor(message: string, opts: Partial<AppClientErrorOptions> = {}) {
    super({ ...opts, message, severity: opts.severity ?? "warning" })
  }
}

/** The user's input or action is genuinely invalid and must change. */
export class ValidationError extends AppClientError {
  constructor(message: string, opts: Partial<AppClientErrorOptions> = {}) {
    super({ ...opts, message, category: "USER", severity: "error" })
  }
}

/**
 * A hard limit was reached (edit cap, daily cap, rate limit). Nothing is
 * broken - the UI should present it as guidance, not as a red failure.
 */
export class LimitError extends AppClientError {
  constructor(message: string, opts: Partial<AppClientErrorOptions> = {}) {
    super({ ...opts, message, category: "USER", severity: "warning" })
  }
}

/**
 * An expected outcome that used to be reported as an error upstream ("already
 * completed", "already a member"). Kept for defense in depth: if the backend
 * ever sends such a state again, the UI degrades to a gentle note instead of
 * a red banner.
 */
export class ExpectedOutcomeError extends AppClientError {
  constructor(message: string, opts: Partial<AppClientErrorOptions> = {}) {
    super({ ...opts, message, category: "USER", severity: "info" })
  }
}

/** Server codes that describe normal outcomes rather than failures. */
export const EXPECTED_OUTCOME_CODES = new Set([
  "ALREADY_VERIFIED",
  "ALREADY_ENABLED",
  "ALREADY_MEMBER",
  "DUPLICATE_ERROR",
  "SLOT_UNAVAILABLE",
])

/** Server codes for constraints the user simply reached. */
export const LIMIT_CODES = new Set([
  "RATE_LIMITED",
  "EDIT_LIMIT_REACHED",
  "EDIT_WINDOW_EXPIRED",
  "LIMIT_REACHED",
  "SPAM_DETECTED",
])

export function isAppClientError(err: unknown): err is AppClientError {
  return err instanceof AppClientError
}

/**
 * Single source of truth for turning any thrown value into a user-facing
 * message + presentation severity. In production, SERVER-category details are
 * replaced with generic copy; in development they pass through for debugging.
 */
export function getUserFeedback(err: unknown): { severity: ErrorSeverity; message: string } {
  if (isAppClientError(err)) {
    const hideDetail = !IS_DEV && err.category === "SERVER"
    return {
      severity: err.severity,
      message: hideDetail
        ? GENERIC_SERVER_MESSAGE
        : err.message || GENERIC_SERVER_MESSAGE,
    }
  }
  if (err instanceof Error) {
    // Plain Errors are unexpected by definition - treat as SERVER-category.
    return {
      severity: "error",
      message: IS_DEV ? err.message : GENERIC_SERVER_MESSAGE,
    }
  }
  return { severity: "error", message: GENERIC_SERVER_MESSAGE }
}

/** Convenience wrapper when only the text is needed. */
export function getErrorMessage(err: unknown): string {
  return getUserFeedback(err).message
}

/** Detailed, developer-facing rendering (message + stack in dev builds). */
export function describeError(err: unknown): string {
  if (!IS_DEV) return getErrorMessage(err)
  if (err instanceof Error) return err.stack ?? `${err.name}: ${err.message}`
  return String(err)
}
