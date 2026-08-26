import { Star, Clock, Flame, BarChart3 } from "lucide-react"
import { TrendChart } from "./sleepComponents"

interface SleepStatsProps {
  stats: {
    totalLogs: number
    avgQuality: number
    avgHours: number
    streak: number
    weeklyTrend: { date: string; quality: number }[]
  }
}

export function SleepStats({ stats }: SleepStatsProps) {
  return (
    <>
      {stats.totalLogs > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <Star className="size-4" />
              <span className="text-xs font-medium">Avg Quality</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgQuality}
              <span className="text-sm font-normal text-gray-400">/5</span>
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <Clock className="size-4" />
              <span className="text-xs font-medium">Avg Hours</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgHours}
              <span className="text-sm font-normal text-gray-400">h</span>
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="flex items-center gap-2 text-amber-500">
              <Flame className="size-4" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-400">
              {stats.streak}
              <span className="text-sm font-normal text-amber-400">d</span>
            </p>
          </div>
        </div>
      )}

      {stats.weeklyTrend.some((d) => d.quality > 0) && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="size-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Quality, Last 7 Days
            </h2>
          </div>
          <TrendChart data={stats.weeklyTrend} />
        </div>
      )}
    </>
  )
}
