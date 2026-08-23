import {
  Moon,
  Star,
  Clock,
  Play,
  Pause,
  Trash2,
  Headphones,
  BookOpen,
  Sparkles,
  TrendingUp,
  Flame,
  BarChart3,
} from "lucide-react"
import { useSleepState } from "./useSleepState"
import { useEffect, useRef, useState } from "react"
import type { SleepContent } from "@/lib/sleep-api"

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  return `${m} min`
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="group/Star focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          aria-label={`Quality ${s}`}
        >
          <Star
            className={`size-7 transition-colors ${
              s <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            } group-hover/Star:fill-amber-300 group-hover/Star:text-amber-300`}
          />
        </button>
      ))}
    </div>
  )
}

function TrendChart({ data }: { data: { date: string; quality: number }[] }) {
  const maxQuality = 5
  const dayLabels = data.map((d) => {
    const dt = new Date(d.date + "T00:00:00")
    return dt.toLocaleDateString(undefined, { weekday: "short" })
  })

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => {
        const pct = d.quality > 0 ? (d.quality / maxQuality) * 100 : 0
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              {d.quality > 0 ? d.quality.toFixed(1) : "—"}
            </span>
            <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
              <div
                className="w-full max-w-8 rounded-t-lg transition-all duration-500 ease-out"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  backgroundColor:
                    d.quality === 0
                      ? "var(--color-border)"
                      : d.quality >= 4
                        ? "#6366f1"
                        : d.quality >= 3
                          ? "#818cf8"
                          : d.quality >= 2
                            ? "#a5b4fc"
                            : "#c7d2fe",
                }}
              />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {dayLabels[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ContentCard({
  item,
  playing,
  onToggle,
}: {
  item: SleepContent
  playing: boolean
  onToggle: () => void
}) {
  const typeIcon =
    item.type === "sound" ? (
      <Headphones className="size-4" />
    ) : item.type === "meditation" ? (
      <Sparkles className="size-4" />
    ) : (
      <BookOpen className="size-4" />
    )

  const categoryColors: Record<string, string> = {
    rain: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    nature: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    ambient: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    meditation: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    body_scan: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
    breathing: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  }

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[item.category] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
              {typeIcon}
              {item.type}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {formatDuration(item.duration)}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {item.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
        </button>
      </div>
    </div>
  )
}

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

  const filteredContent = s.content.filter((c) => c.type === activeTab)

  const handleLog = async () => {
    if (!quality) return

    // Calculate hours from times
    let hoursSlept = 0
    if (bedtime && wakeTime) {
      const [bh, bm] = bedtime.split(":").map(Number)
      const [wh, wm] = wakeTime.split(":").map(Number)
      let bedMins = bh * 60 + bm
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
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
            <Moon className="size-5 text-indigo-600 dark:text-indigo-400" />
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

      {/* Stats Row */}
      {s.stats && s.stats.totalLogs > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <Star className="size-4" />
              <span className="text-xs font-medium">Avg Quality</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {s.stats.avgQuality}
              <span className="text-sm font-normal text-gray-400">/5</span>
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <Clock className="size-4" />
              <span className="text-xs font-medium">Avg Hours</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {s.stats.avgHours}
              <span className="text-sm font-normal text-gray-400">h</span>
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-950/30">
            <div className="flex items-center gap-2 text-orange-500">
              <Flame className="size-4" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-orange-700 dark:text-orange-400">
              {s.stats.streak}
              <span className="text-sm font-normal text-orange-400">d</span>
            </p>
          </div>
        </div>
      )}

      {/* Weekly Trend */}
      {s.stats && s.stats.weeklyTrend.some((d) => d.quality > 0) && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="size-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Quality — Last 7 Days
            </h2>
          </div>
          <TrendChart data={s.stats.weeklyTrend} />
        </div>
      )}

      {/* Log Sleep Button / Form */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 py-4 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:border-indigo-800"
        >
          <Moon className="size-4" />
          Log Sleep
        </button>
      )}

      {showForm && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-5 dark:border-indigo-900/50 dark:bg-gray-900 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Log Last Night's Sleep
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Sleep Quality
            </label>
            <StarRating value={quality} onChange={setQuality} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Wake Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {bedtime && wakeTime && (
            <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <TrendingUp className="mr-1 inline size-3" />
              Calculated:{" "}
              {(() => {
                const [bh, bm] = bedtime.split(":").map(Number)
                const [wh, wm] = wakeTime.split(":").map(Number)
                let bedMins = bh * 60 + bm
                let wakeMins = wh * 60 + wm
                if (wakeMins < bedMins) wakeMins += 24 * 60
                return ((wakeMins - bedMins) / 60).toFixed(1)
              })()}{" "}
              hours
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Notes <span className="text-gray-300 dark:text-gray-600">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="How was your sleep?"
            />
            <span className="text-[10px] text-gray-300 dark:text-gray-600">
              {notes.length}/500
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Dreams <span className="text-gray-300 dark:text-gray-600">(optional)</span>
            </label>
            <textarea
              value={dreams}
              onChange={(e) => setDreams(e.target.value)}
              maxLength={500}
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Any dreams you'd like to remember?"
            />
            <span className="text-[10px] text-gray-300 dark:text-gray-600">
              {dreams.length}/500
            </span>
          </div>

          <button
            onClick={handleLog}
            disabled={s.saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-md shadow-indigo-900/20 transition-colors hover:bg-indigo-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <Moon className="size-4" />
            {s.saving ? "Saving..." : "Log Sleep"}
          </button>
        </div>
      )}

      {/* Content Library */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Sleep Library
        </h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          <TabButton
            active={activeTab === "sound"}
            onClick={() => setActiveTab("sound")}
            icon={<Headphones className="size-4" />}
            label="Sounds"
          />
          <TabButton
            active={activeTab === "meditation"}
            onClick={() => setActiveTab("meditation")}
            icon={<Sparkles className="size-4" />}
            label="Meditations"
          />
          <TabButton
            active={activeTab === "story"}
            onClick={() => setActiveTab("story")}
            icon={<BookOpen className="size-4" />}
            label="Stories"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredContent.map((item) => (
            <ContentCard
              key={item._id}
              item={item}
              playing={playingId === item._id}
              onToggle={() => togglePlay(item._id)}
            />
          ))}
        </div>
        {!s.contentLoading && filteredContent.length === 0 && (
          <EmptyState
            icon={Headphones}
            title={
              activeTab === "sound"
                ? "No sounds available yet"
                : activeTab === "meditation"
                  ? "No meditations available yet"
                  : "No stories available yet"
            }
            description="Calming audio to help you unwind and drift off. The sleep library is curated by our care team — new content is added regularly."
          />
        )}
      </div>

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
      {s.logs.length === 0 && !s.loading && s.stats && s.stats.totalLogs === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Moon className="mb-4 size-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">
            No sleep logs yet.
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Start tracking your sleep above.
          </p>
        </div>
      )}
    </div>
  )
}
