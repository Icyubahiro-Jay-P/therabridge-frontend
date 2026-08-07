import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"

export interface MoodEntry {
  _id: string
  mood: string
  emoji: string
  note: string
  factors: string[]
  intensity: number
  date: string
}

export interface MoodStats {
  total: number
  averageIntensity: number
  moodDistribution: Record<string, number>
  streak: number
}

export const moodOptions = [
  { value: "great", emoji: "😄", label: "Great", color: "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { value: "good", emoji: "🙂", label: "Good", color: "bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300" },
  { value: "okay", emoji: "😐", label: "Okay", color: "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300" },
  { value: "bad", emoji: "😔", label: "Bad", color: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300" },
  { value: "terrible", emoji: "😢", label: "Terrible", color: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300" },
]

export const factorOptions = [
  "Sleep", "Exercise", "Work", "Relationships", "Health", "Family",
  "Friends", "Weather", "Food", "Hobbies", "Stress", "Medication",
  "Therapy", "School", "Finances",
]

export const intensityLabels = ["Very low", "Low", "Moderate", "High", "Very high"]

export function useMoodState() {
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [stats, setStats] = useState<MoodStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState("")
  const [note, setNote] = useState("")
  const [intensity, setIntensity] = useState(5)
  const [factors, setFactors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [moodsRes, statsRes] = await Promise.all([
        api.get<{ data: MoodEntry[] }>("/api/mood?days=30"),
        api.get<MoodStats>("/api/mood/stats"),
      ])
      setMoods(moodsRes.data.data ?? [])
      setStats(statsRes.data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load mood data"
      setLoadError(msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadData() }, [loadData])

  async function reload() {
    setLoading(true)
    setLoadError(null)
    await loadData()
  }

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

      try {
        const { data: newStats } = await api.get<MoodStats>("/api/mood/stats")
        setStats(newStats)
      } catch {
        // stats refresh is non-critical
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log mood")
    } finally {
      setSaving(false)
    }
  }

  return {
    moods, stats, loading, loadError, error, success,
    selectedMood, note, intensity, factors, saving,
    setSelectedMood, setNote, setIntensity, toggleFactor, handleLog,
    setError, setSuccess, reload,
  }
}
