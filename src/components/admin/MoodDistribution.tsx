import { Heart } from "lucide-react"

const MOOD_ORDER = ["great", "good", "okay", "bad", "terrible"] as const

const MOOD_COLORS: Record<(typeof MOOD_ORDER)[number], string> = {
  great: "bg-emerald-500",
  good: "bg-teal-400",
  okay: "bg-amber-400",
  bad: "bg-amber-600",
  terrible: "bg-red-500",
}

export function MoodDistribution({
  distribution,
}: {
  distribution: { great: number; good: number; okay: number; bad: number; terrible: number }
}) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mood check-ins
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last 30 days · {total} entries
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <Heart className="size-4" />
        </span>
      </div>

      {total === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No mood entries yet this month.
        </p>
      ) : (
        <div className="space-y-2.5">
          {MOOD_ORDER.map((mood) => {
            const count = distribution[mood]
            return (
              <div key={mood} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm capitalize text-gray-600 dark:text-gray-400">
                  {mood}
                </span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all ${MOOD_COLORS[mood]}`}
                    style={{ width: `${(count / Math.max(total, 1)) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm tabular-nums text-gray-500">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
