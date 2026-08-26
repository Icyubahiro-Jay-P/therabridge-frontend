import { Pill, TrendingUp, Flame } from "lucide-react"
import type { AdherenceStats } from "./types"

export function MedicationsStatsBar({ stats }: { stats: AdherenceStats }) {
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <TrendingUp className="size-5 text-emerald-500" />
        <div>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{stats.adherenceRate}%</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500">adherence</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
        <Flame className="size-5 text-amber-600" />
        <div>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{stats.streak}</p>
          <p className="text-xs text-amber-600 dark:text-amber-600">day streak</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <Pill className="size-5 text-gray-400" />
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.takenDoses}/{stats.totalDoses}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">doses taken</p>
        </div>
      </div>
    </div>
  )
}
