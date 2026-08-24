import { useState, useCallback } from "react"
import { gratitudeApi, type GratitudePrompt, type GratitudeEntry, type GratitudeStreak } from "@/lib/gratitude-api"
import { getErrorMessage } from "@/lib/errors"
import { runOptimistic } from "@/lib/optimistic"

export function useGratitudeState() {
  const [prompt, setPrompt] = useState<GratitudePrompt | null>(null)
  const [hasEntryToday, setHasEntryToday] = useState(false)
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [streak, setStreak] = useState<GratitudeStreak | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
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
    setInfo(null)
    setSuccess(null)
    try {
      const entry = await gratitudeApi.create({
        promptId: prompt.id,
        promptText: prompt.text,
        content,
      })
      setHasEntryToday(true)
      if (entry.alreadyCompleted) {
        // Already done today is a normal repeat visit, not a failure.
        setInfo("You've already completed today's gratitude prompt. Come back tomorrow!")
        return entry
      }
      setEntries((prev) => [entry, ...prev])
      fetchStreak()
      setSuccess("Gratitude logged!")
      return entry
    } catch (err: unknown) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setSaving(false)
    }
  }, [prompt, fetchStreak])

  const deleteEntry = useCallback(async (id: string) => {
    await runOptimistic({
      lockKey: `gratitude-entry:${id}`,
      snapshot: () => entries.find((e) => e._id === id) ?? null,
      apply: () => setEntries((prev) => prev.filter((e) => e._id !== id)),
      commit: () => gratitudeApi.delete(id),
      rollback: (entry) => {
        if (!entry) return
        setEntries((prev) => {
          if (prev.some((e) => e._id === id)) return prev
          const next = [...prev]
          next.unshift(entry)
          return next
        })
      },
      onError: (err) => setError(getErrorMessage(err)),
    })
  }, [entries])

  return {
    prompt, hasEntryToday, entries, streak,
    loading, saving, error, info, success, hasMore,
    fetchPrompt, fetchEntries, fetchStreak, createEntry, deleteEntry,
    clearMessages: () => { setError(null); setInfo(null); setSuccess(null) },
  }
}
