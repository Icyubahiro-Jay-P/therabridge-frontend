import { BarChart3 } from "lucide-react"
import type { DashboardActivityPoint } from "./dashboard-types"

const SERIES = [
  { key: "messages", label: "DMs", color: "bg-sky-500" },
  { key: "communityMessages", label: "Community", color: "bg-violet-500" },
  { key: "moods", label: "Mood logs", color: "bg-emerald-500" },
  { key: "exercises", label: "Exercises", color: "bg-amber-500" },
  { key: "crises", label: "Crises", color: "bg-red-500" },
  { key: "signups", label: "Signups", color: "bg-teal-500" },
] as const

export function ActivityChart({ data }: { data: DashboardActivityPoint[] }) {
  const max = Math.max(1, ...data.map((d) => Math.max(
    d.messages,
    d.communityMessages,
    d.moods,
    d.exercises,
    d.crises,
    d.signups
  )))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Platform activity
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last 14 days, across all users
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <BarChart3 className="size-4" />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pb-4 text-xs text-gray-500 dark:text-gray-400">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${s.color}`} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex h-44 items-end gap-1.5 overflow-x-auto pb-1">
        {data.map((point) => (
          <div key={point.date} className="group relative flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-36 w-full flex-col-reverse items-center gap-px">
              {SERIES.map((s) => {
                const value = point[s.key]
                const height = Math.round((value / max) * 100)
                return (
                  <div
                    key={s.key}
                    className={`w-full rounded-sm ${s.color} transition-all group-hover:opacity-80`}
                    style={{
                      height: `${Math.max(value > 0 ? 8 : 2, height)}%`,
                      opacity: value > 0 ? 1 : 0.08,
                    }}
                  >
                    <span className="sr-only">{`${s.label}: ${value}`}</span>
                  </div>
                )
              })}
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {point.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
