import { Moon, Star, Trash2 } from "lucide-react"
import { useSleepState } from "./useSleepState"
import { EmptyState } from "@/components/user/shared/EmptyState"
import { useEffect, useRef, useState } from "react"
import { SleepLogForm } from "./SleepLogForm"
import { SleepContentLibrary } from "./SleepContentLibrary"
import { SleepStats } from "./SleepStats"

export function SleepPage() {
  const s = useSleepState()
  const initializedRef = useRef(false)
  const [activeTab, setActiveTab] = useState<"sound" | "meditation" | "story">("sound")
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [quality, setQuality] = useState(3)
  const [bedtime, setBedtime] = useState("")
  const [wakeTime, setWakeTime] = useState("")
  const [notes, setNotes] = useState("")
  const [dreams, setDreams] = useState("")

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      s.fetchLogs()
      s.fetchStats()
      s.fetchContent()
    }
  })

  const handleLog = async () => {
    if (!quality) return

    // Calculate hours from times
    let hoursSlept = 0
    if (bedtime && wakeTime) {
      const [bh, bm] = bedtime.split(":").map(Number)
      const [wh, wm] = wakeTime.split(":").map(Number)
      const bedMins = bh * 60 + bm
      let wakeMins = wh * 60 + wm
      if (wakeMins < bedMins) wakeMins += 24 * 60
      hoursSlept = Math.round(((wakeMins - bedMins) / 60) * 10) / 10
    }

    const result = await s.logSleepEntry({
      quality,
      bedtime,
      wakeTime,
      hoursSlept,
      notes: notes || undefined,
      dreams: dreams || undefined,
    })

    if (result) {
      setQuality(3)
      setBedtime("")
      setWakeTime("")
      setNotes("")
      setDreams("")
      setShowForm(false)
      s.fetchLogs(1)
    }
  }

  const togglePlay = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/40">
            <Moon className="size-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sleep
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your rest and unwind with guided content.
            </p>
          </div>
        </div>
      </div>

      {/* Success / Error */}
      {s.success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {s.success}
        </div>
      )}
      {s.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {s.error}
        </div>
      )}

      {/* Stats Row & Weekly Trend */}
      {s.stats && <SleepStats stats={s.stats} />}

      {/* Log Sleep Button / Form */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 py-4 text-sm font-medium text-teal-600 transition-colors hover:border-teal-300 hover:bg-teal-50 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-teal-400 dark:hover:border-teal-800"
        >
          <Moon className="size-4" />
          Log Sleep
        </button>
      )}

      {showForm && (
        <SleepLogForm
          quality={quality}
          setQuality={setQuality}
          bedtime={bedtime}
          setBedtime={setBedtime}
          wakeTime={wakeTime}
          setWakeTime={setWakeTime}
          notes={notes}
          setNotes={setNotes}
          dreams={dreams}
          setDreams={setDreams}
          onSubmit={handleLog}
          saving={s.saving}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Content Library */}
      <SleepContentLibrary
        content={s.content}
        contentLoading={s.contentLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        playingId={playingId}
        togglePlay={togglePlay}
      />

      {/* Past Logs */}
      {s.logs.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Sleep History
          </h2>
          <div className="space-y-2">
            {s.logs.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex shrink-0 items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`size-3.5 ${
                          st <= log.quality
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {log.hoursSlept > 0
                        ? `${log.hoursSlept}h`
                        : "No duration"}
                      {log.bedtime && log.wakeTime
                        ? ` · ${log.bedtime}–${log.wakeTime}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(log.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => s.deleteLogEntry(log._id)}
                  className="shrink-0 rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-600 dark:hover:bg-red-950/30"
                  aria-label="Delete log"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!s.error && !s.loading && s.logs.length === 0 && (
        <EmptyState
          icon={Moon}
          title="No sleep logs yet"
          description="Logging your sleep each morning helps you spot patterns between your rest, mood and energy over time."
          action={
            <button
              onClick={() => {
                setShowForm(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Moon className="size-4" />
              Log your first night
            </button>
          }
        />
      )}
    </div>
  )
}
