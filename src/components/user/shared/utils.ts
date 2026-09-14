// Canonical implementation lives in lib/errors.ts (env-aware taxonomy);
// re-exported here so existing relative imports keep working.
export { getErrorMessage } from "@/lib/errors"

export function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffSec = diffMs / 1000
  if (diffSec < 60) return "just now"
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`

  const days = Math.floor(diffSec / 86400)
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 14) return "last week"
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return date.toLocaleDateString()
}

export function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface GroupableMessage {
  sender: { _id: string }
  createdAt: string
  kind?: string
}

const GROUP_GAP_MS = 5 * 60 * 1000

function inSameGroup(a: GroupableMessage, b: GroupableMessage) {
  if ((a.kind && a.kind !== "message") || (b.kind && b.kind !== "message")) {
    return false
  }
  if (a.sender._id !== b.sender._id) return false
  const gap = Math.abs(
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return gap < GROUP_GAP_MS
}

/**
 * Instagram-style clustering: consecutive messages from the same sender,
 * sent within a few minutes of each other, collapse into one visual group
 * (avatar/name shown once, tighter gap between bubbles).
 */
export function getGroupPosition<T extends GroupableMessage>(
  messages: T[],
  index: number
) {
  const msg = messages[index]
  const prev = messages[index - 1]
  const next = messages[index + 1]
  return {
    isGroupStart: !prev || !inSameGroup(prev, msg),
    isGroupEnd: !next || !inSameGroup(msg, next),
  }
}

export function loadSetting<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) {
      const s = JSON.parse(stored)
      return s[key] ?? fallback
    }
  } catch {
    // Fall back to the default when stored settings are corrupt.
  }
  return fallback
}
