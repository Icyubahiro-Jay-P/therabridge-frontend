import { CheckCircle2, Flame } from "lucide-react"

import type { ExerciseLogEntry } from "./useHomeState"

interface UpcomingAppointmentsProps {
  logs: ExerciseLogEntry[]
}

export function UpcomingAppointments({ logs }: UpcomingAppointmentsProps) {
  const completedLogs = logs.filter((l) => l.completed)

  if (completedLogs.length === 0) return null

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Flame className="size-5 text-emerald-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Recent completions
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {completedLogs.slice(0, 10).map((log) => (
          <div
            key={log._id}
            className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="size-3" />
            <span>
              {log.exercise.emoji} {log.exercise.title}
            </span>
            {log.completedAt && (
              <span className="text-emerald-400 dark:text-emerald-500">
                {new Date(log.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
