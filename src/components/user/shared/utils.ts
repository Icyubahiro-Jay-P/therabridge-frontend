export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return "Something went wrong"
}

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

export function loadSetting<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) {
      const s = JSON.parse(stored)
      return s[key] ?? fallback
    }
  } catch {}
  return fallback
}
