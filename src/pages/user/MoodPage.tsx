import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Loader2,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface MoodEntry {
  _id: string
  mood: string
  emoji: string
  note: string
  factors: string[]
  intensity: number
  date: string
}

interface MoodStats {
  total: number
  averageIntensity: number
  moodDistribution: Record<string, number>
  streak: number
}

const moodOptions = [
  { value: "great", emoji: "😄", label: "Great", color: "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { value: "good", emoji: "🙂", label: "Good", color: "bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300" },
  { value: "okay", emoji: "😐", label: "Okay", color: "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300" },
  { value: "bad", emoji: "😔", label: "Bad", color: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300" },
  { value: "terrible", emoji: "😢", label: "Terrible", color: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300" },
]

const factorOptions = [
  "Sleep", "Exercise", "Work", "Relationships", "Health", "Family", "Friends", "Weather",
  "Food", "Hobbies", "Stress", "Medication", "Therapy", "School", "Finances",
]

const intensityLabels = ["Very low", "Low", "Moderate", "High", "Very high"]

export function MoodPage() {
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [stats, setStats] = useState<MoodStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [selectedMood, setSelectedMood] = useState("")
  const [note, setNote] = useState("")
  const [intensity, setIntensity] = useState(5)
  const [factors, setFactors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [moodsRes, statsRes] = await Promise.all([
          api.get<MoodEntry[]>("/api/mood?days=30"),
          api.get<MoodStats>("/api/mood/stats"),
        ])
        setMoods(moodsRes.data)
        setStats(statsRes.data)
      } catch {} finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  function toggleFactor(f: string) {
    setFactors((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  }

  async function handleLog() {
    if (!selectedMood) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const { data } = await api.post<MoodEntry>("/api/mood", { mood: selectedMood, note, intensity, factors })
      setMoods((prev) => [data, ...prev])
      setSuccess("Mood logged!")
      setSelectedMood("")
      setNote("")
      setIntensity(5)
      setFactors([])
      const { data: newStats } = await api.get<MoodStats>("/api/mood/stats")
      setStats(newStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log mood")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mood Tracker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track how you're feeling and discover patterns.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" /> {success}
        </div>
      )}

      {/* Log Mood */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">How are you feeling?</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {moodOptions.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMood(m.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                selectedMood === m.value ? `${m.color} ring-2 ring-offset-2` : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              )}
            >
              <span className="text-lg">{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Intensity: {intensityLabels[Math.min(Math.floor(intensity / 2.5), 4)]}
          </p>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Factors (optional)</p>
          <div className="flex flex-wrap gap-1.5">
            {factorOptions.map((f) => (
              <button
                key={f}
                onClick={() => toggleFactor(f)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  factors.includes(f)
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          maxLength={500}
          rows={2}
          className="mb-4"
        />

        <Button onClick={handleLog} disabled={!selectedMood || saving} className="bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="size-4 animate-spin" /> : "Log mood"}
        </Button>
      </div>

      {/* Stats */}
      {stats && (
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
      )}

      {/* Recent entries */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent entries</h2>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-gray-400" /></div>
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
    </div>
  )
}
