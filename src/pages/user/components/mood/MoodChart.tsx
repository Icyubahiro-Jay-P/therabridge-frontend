import { Skeleton } from "@/components/ui/skeleton"
import type { MoodStats } from "./useMoodState"

interface MoodChartProps {
  stats: MoodStats | null
}

export function MoodChart({ stats }: MoodChartProps) {
  if (!stats) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">30-Day Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const dist = stats.moodDistribution ?? {}
  const total = stats.total || 1

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">30-Day Overview</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Total Entries</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Avg Intensity</p>
          <p className="text-2xl font-bold">{stats.averageIntensity ?? "-"}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-bold">{stats.streak} days</p>
        </div>
        <div className="rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Most Frequent</p>
          <p className="text-2xl font-bold capitalize">
            {Object.entries(dist).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-"}
          </p>
        </div>
      </div>

      <h3 className="mb-3 mt-6 text-sm font-medium text-gray-600 dark:text-gray-400">Mood Distribution</h3>
      <div className="space-y-2">
        {Object.entries(dist).map(([mood, count]) => (
          <div key={mood} className="flex items-center gap-3">
            <span className="w-20 text-sm capitalize text-gray-600 dark:text-gray-400">{mood}</span>
            <div className="h-5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-sm text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
