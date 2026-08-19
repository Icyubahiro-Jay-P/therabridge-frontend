import { useState, useCallback } from "react"
import { gratitudeApi, type GratitudePrompt, type GratitudeEntry, type GratitudeStreak } from "@/lib/gratitude-api"

export function useGratitudeState() {
  const [prompt, setPrompt] = useState<GratitudePrompt | null>(null)
  const [hasEntryToday, setHasEntryToday] = useState(false)
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [streak, setStreak] = useState<GratitudeStreak | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchPrompt = useCallback(async () => {
    setLoading(true)
    try {
      const res = await gratitudeApi.getDailyPrompt()
      setPrompt(res.prompt)
      setHasEntryToday(res.hasEntryToday)
    } catch {
      setError("Failed to load prompt")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEntries = useCallback(async (page = 1) => {
    try {
      const res = await gratitudeApi.list({ page })
      setEntries((prev) => (page === 1 ? res.entries : [...prev, ...res.entries]))
      setHasMore(res.hasMore)
    } catch {
      // non-critical
    }
  }, [])

  const fetchStreak = useCallback(async () => {
    try {
      const res = await gratitudeApi.streak()
      setStreak(res)
    } catch {
      // non-critical
    }
  }, [])

  const createEntry = useCallback(async (content: string) => {
    if (!prompt) return null
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const entry = await gratitudeApi.create({
        promptId: prompt.id,
        promptText: prompt.text,
        content,
      })
      setEntries((prev) => [entry, ...prev])
      setHasEntryToday(true)
      fetchStreak()
      setSuccess(entry.pointsEarned ? `Gratitude logged! +${entry.pointsEarned} wellness points` : "Gratitude logged!")
      return entry
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save"
      setError(msg.includes("already completed") ? msg : "Failed to save gratitude entry")
      return null
    } finally {
      setSaving(false)
    }
  }, [prompt, fetchStreak])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await gratitudeApi.delete(id)
      setEntries((prev) => prev.filter((e) => e._id !== id))
    } catch {
      setError("Failed to delete entry")
    }
  }, [])

  return {
    prompt, hasEntryToday, entries, streak,
    loading, saving, error, success, hasMore,
    fetchPrompt, fetchEntries, fetchStreak, createEntry, deleteEntry,
    clearMessages: () => { setError(null); setSuccess(null) },
  }
}
