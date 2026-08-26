import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"

export interface MoodEntry {
  _id: string
  mood: string
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
  { value: "great", label: "Great", color: "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { value: "good", label: "Good", color: "bg-teal-100 text-teal-700 border-teal-300 hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-300" },
  { value: "okay", label: "Okay", color: "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300" },
  { value: "bad", label: "Bad", color: "bg-amber-200 text-amber-900 border-amber-400 hover:bg-amber-300 dark:bg-amber-800/60 dark:text-amber-200" },
  { value: "terrible", label: "Terrible", color: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300" },
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

  useEffect(() => {
    let mounted = true
    async function initialLoad() {
      try {
        const [moodsRes, statsRes] = await Promise.all([
          api.get<{ data: MoodEntry[] }>("/api/mood?days=30"),
          api.get<MoodStats>("/api/mood/stats"),
        ])
        if (mounted) {
          setMoods(moodsRes.data.data ?? [])
          setStats(statsRes.data)
        }
      } catch (err) {
        if (mounted) {
          const msg = err instanceof Error ? err.message : "Failed to load mood data"
          setLoadError(msg)
          setError(msg)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void initialLoad()
    return () => { mounted = false }
  }, [])

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
      const { data } = await api.post<MoodEntry>("/api/mood", { mood: selectedMood, note, intensity, factors }, {
        headers: { "Idempotency-Key": `mood-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      })
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
