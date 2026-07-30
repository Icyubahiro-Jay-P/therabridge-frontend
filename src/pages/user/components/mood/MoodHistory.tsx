import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { moodOptions, type MoodEntry } from "./useMoodState"

interface MoodHistoryProps {
  moods: MoodEntry[]
  loading: boolean
}

function MoodEntrySkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <Skeleton className="size-8 rounded" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-48" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="size-1.5 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export function MoodHistory({ moods, loading }: MoodHistoryProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent entries</h2>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <MoodEntrySkeleton key={i} />)}
        </div>
      ) : moods.length === 0 ? (
        <p className="text-sm text-gray-400">No mood entries yet.</p>
      ) : (
        <div className="space-y-2">
          {moods.slice(0, 20).map((m) => {
            const moodOpt = moodOptions.find((o) => o.value === m.mood)
            return (
              <div key={m._id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <span className="text-2xl">{moodOpt?.emoji || m.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{m.mood}</span>
                    <span className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  {m.note && <p className="mt-0.5 text-sm text-gray-500">{m.note}</p>}
                  {m.factors && m.factors.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.factors.map((f) => (
                        <span key={f} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={cn("size-1.5 rounded-full", i < Math.round(m.intensity / 2) ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700")} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
