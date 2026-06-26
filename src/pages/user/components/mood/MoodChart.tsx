import type { MoodStats } from "./useMoodState"

interface MoodChartProps {
  stats: MoodStats | null
}

export function MoodChart({ stats }: MoodChartProps) {
  if (!stats) return null

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700/60">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        <p className="text-xs text-gray-400">Total entries</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700/60">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageIntensity}</p>
        <p className="text-xs text-gray-400">Avg intensity</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700/60">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak} days</p>
        <p className="text-xs text-gray-400">Mood streak</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700/60">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {Object.entries(stats.moodDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "--"}
        </p>
        <p className="text-xs text-gray-400">Most common</p>
      </div>
    </div>
  )
}
