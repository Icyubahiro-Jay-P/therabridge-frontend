import { useState } from "react"
import { ChevronDown, Eye, MessageCircle, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  DISCLAIMER,
  RISK_LEVEL_META,
  type ClientRiskSummary,
} from "@/lib/riskSummary"

interface ChatUser {
  _id: string
  username: string
  firstName: string
  lastName: string
}

function formatDaysAgo(days: number | null): string {
  if (days === null) return "Never"
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

function signalValue(summary: ClientRiskSummary): number {
  const s = summary.signals
  return (
    s.mood.negativeLast7d +
    s.crisis.recentAlerts7d +
    (s.crisis.severeLast24h ? 1 : 0) +
    (s.exercise.completedLast14d === 0 ? 1 : 0) +
    (s.login.daysSinceLastLogin !== null && s.login.daysSinceLastLogin >= 7 ? 1 : 0)
  )
}

export function ClientListItem({
  client,
  summary,
  onViewProfile,
}: {
  client: ChatUser
  summary?: ClientRiskSummary
  onViewProfile: (id: string) => void
}) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const meta = summary ? RISK_LEVEL_META[summary.signalLevel] : RISK_LEVEL_META.low
  const hasSignals = summary ? signalValue(summary) > 0 : false

  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            {client.firstName[0]}{client.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <span className="truncate">
                {client.firstName} {client.lastName}
              </span>
              {summary && hasSignals && (
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.text} ${meta.bg}`}
                  title="Risk signal - see expandable details"
                >
                  <span className={`size-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              )}
            </p>
            <p className="truncate text-xs text-gray-400">@{client.username}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {summary && hasSignals && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs"
              aria-expanded={expanded}
            >
              <ShieldAlert className="size-3.5" />
              Signals
              <ChevronDown
                className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onViewProfile(client._id)} className="text-xs">
            <Eye className="size-3.5" /> Profile
          </Button>
          <Button size="sm" onClick={() => navigate(`/chat/${client.username}`)} className="bg-emerald-600 hover:bg-emerald-700 text-xs">
            <MessageCircle className="size-3.5" /> Message
          </Button>
        </div>
      </div>

      {summary && expanded && (
        <div className={`mx-5 mb-4 rounded-xl border px-4 py-3 ${meta.bg}`}>
          {summary.reasons.length > 0 ? (
            <ul className="space-y-1">
              {summary.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200">
                  <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${meta.dot}`} />
                  {reason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Nothing stands out right now.
            </p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-current/10 pt-3 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-4">
            <div>
              <p className="text-gray-400">Mood</p>
              <p className="font-medium capitalize">
                {summary.signals.mood.lastMood ?? "--"} · {summary.signals.mood.trend}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Crisis (7d)</p>
              <p className="font-medium">{summary.signals.crisis.recentAlerts7d}</p>
            </div>
            <div>
              <p className="text-gray-400">Exercises (14d)</p>
              <p className="font-medium">{summary.signals.exercise.completedLast14d}</p>
            </div>
            <div>
              <p className="text-gray-400">Last login</p>
              <p className="font-medium">
                {formatDaysAgo(summary.signals.login.daysSinceLastLogin)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">{DISCLAIMER}</p>
        </div>
      )}
    </div>
  )
}
