import { Link } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import type { DashboardCrisis } from "./dashboard-types"

const TYPE_LABELS: Record<string, string> = {
  immediate_danger: "Immediate danger",
  severe_distress: "Severe distress",
  panic_attack: "Panic attack",
  self_harm_thoughts: "Self-harm thoughts",
  emergency: "Emergency",
}

const SEVERITY_STYLES: Record<string, { badge: string; dot: string }> = {
  severe: {
    badge: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    dot: "bg-red-500",
  },
  medium: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  mild: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(mins, 1)}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ActiveCrises({ crises }: { crises: DashboardCrisis[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active crisis alerts
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Needs attention right now
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400">
          <AlertTriangle className="size-4" />
        </span>
      </div>

      {crises.length === 0 ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-6 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          No active alerts — all clear.
        </div>
      ) : (
        <ul className="space-y-3">
          {crises.map((c) => {
            const style = SEVERITY_STYLES[c.severity] ?? SEVERITY_STYLES.medium
            return (
              <li
                key={c._id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-2.5 dark:border-gray-800"
              >
                <span className={`size-2.5 shrink-0 rounded-full ${style.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {c.user ? c.user.firstName : "Deleted user"}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {TYPE_LABELS[c.alertType] ?? c.alertType} · {timeAgo(c.createdAt)}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${style.badge}`}>
                  {c.severity}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {crises.length > 0 && (
        <Link
          to="/crisis"
          className="mt-4 block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          View all alerts
        </Link>
      )}
    </div>
  )
}
