import { api } from "./api"
import type {
  ScreenshotEventPayload,
  ViewingSessionPayload,
} from "./protectionTypes"

// Client-side API client for the protected-content / screenshot-event backend
// endpoints, with client-side deduplication so multiple browser signals from a
// single capture window produce at most one report. The server enforces its
// own authoritative dedup + rate limiting too; this is a first line of defense
// against noisy heuristic signals.

const CLIENT_DEDUP_WINDOW_MS = 6000
const clientDedup = new Map<string, number>()
let sessionTokenCache = new Map<string, string>()

function dedupKey(contentId: string, eventType: string): string {
  return `${contentId}:${eventType}:${Math.floor(Date.now() / CLIENT_DEDUP_WINDOW_MS)}`
}

function claimClientDedup(contentId: string, eventType: string): boolean {
  const key = dedupKey(contentId, eventType)
  const now = Date.now()
  const last = clientDedup.get(key) ?? 0
  if (now - last < CLIENT_DEDUP_WINDOW_MS) return false
  clientDedup.set(key, now)
  return true
}

export interface OpenSessionResult {
  sessionId: string
  sessionToken: string
}

/** Create (or reuse) a viewing session for a piece of protected content. */
export async function openProtectedSession(
  payload: ViewingSessionPayload,
): Promise<OpenSessionResult | null> {
  try {
    const { data } = await api.post<OpenSessionResult>(
      "/api/protected/session",
      payload,
    )
    sessionTokenCache.set(payload.contentId, data.sessionToken)
    return data
  } catch {
    return null
  }
}

/** Report a screenshot/capture event tied to the current viewing session. */
export async function reportScreenshotEvent(
  payload: Omit<ScreenshotEventPayload, "sessionToken">,
  { contentId, eventType, force = false }: { contentId: string; eventType: string; force?: boolean },
): Promise<boolean> {
  if (!force && !claimClientDedup(contentId, eventType)) return false

  const sessionToken = sessionTokenCache.get(contentId)
  if (!sessionToken) return false

  try {
    await api.post("/api/screenshot-events", {
      ...payload,
      sessionToken,
    })
    return true
  } catch {
    return false
  }
}

/** Forget a session cache entry (e.g. on close). */
export function clearProtectedSession(contentId: string): void {
  sessionTokenCache.delete(contentId)
}

/** Force-clear all client-side dedup state (e.g. on logout). */
export function resetScreenshotClient(): void {
  clientDedup.clear()
  sessionTokenCache.clear()
}
