// Client risk-insight contract for the therapist roster (B3). Mirrors
// GET /api/therapist/clients/risk-summary. Deliberately "signals to check in
// on" — never a diagnosis.
export interface ClientSignals {
  mood: {
    negativeLast7d: number
    lastMood: string | null
    trend: string
  }
  crisis: {
    recentAlerts7d: number
    lastAlertType: string | null
    lastSeverity: string | null
    severeLast24h: boolean
  }
  exercise: {
    completedLast14d: number
    lastCompletedAt: string | null
  }
  login: {
    daysSinceLastLogin: number | null
    loginStreak: number
  }
}

export interface ClientRiskSummary {
  userId: string
  firstName: string
  lastName: string
  username: string
  signalLevel: "low" | "medium" | "high"
  reasons: string[]
  signals: ClientSignals
}

export const RISK_LEVEL_META: Record<
  ClientRiskSummary["signalLevel"],
  { label: string; dot: string; text: string; bg: string }
> = {
  high: {
    label: "High signal",
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50",
  },
  medium: {
    label: "Medium signal",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50",
  },
  low: {
    label: "Low signal",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50",
  },
}

export const DISCLAIMER =
  "These are signals for you to check in on — not a diagnosis."
