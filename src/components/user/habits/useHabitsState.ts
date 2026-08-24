import { useState, useCallback, useRef } from "react"
import { habitsApi, type HabitWithProgress, type HabitsSummary, type HabitPayload } from "@/lib/habits-api"
import { getErrorMessage } from "@/lib/errors"

export const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

}

export function useHabitsState() {
  const [habits, setHabits] = useState<HabitWithProgress[]>([])
  const [summary, setSummary] = useState<HabitsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [viewDate, setViewDate] = useState(todayKey())
  const [showArchived, setShowArchived] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithProgress | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const pendingTogglesRef = useRef(new Set<string>())

  const fetchHabits = useCallback(async (date?: string) => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await habitsApi.list({ date: date ?? undefined })
      setHabits(data.habits)
      setSummary(data.summary)
    } catch (err) {
      setLoadError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  // Optimistic toggle - flip the local completed set immediately and reconcile
  // with the server's streak/rate math once it responds.
  const toggleHabit = useCallback(
    async (habitId: string, date: string) => {
      if (pendingTogglesRef.current.has(`${habitId}:${date}`)) return
      pendingTogglesRef.current.add(`${habitId}:${date}`)

      const target = habits.find((x) => x._id === habitId)
      if (!target) return
      const wasDone = target.completedDates.includes(date)

      setHabits((prev) =>
        prev.map((h) => {
          if (h._id !== habitId) return h
          const next = wasDone
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date].sort()
          return { ...h, completedDates: next }
        }),
      )
      const snapshotCompleted = [...target.completedDates]
      const snapshotSummary = summary

      setSummary((prev) => {
        if (!prev || prev.date !== date) return prev
        if (!target.daysOfWeek.includes(new Date(`${date}T00:00:00`).getDay())) return prev
        return {
          ...prev,
          todayCompleted: Math.max(0, prev.todayCompleted + (wasDone ? -1 : 1)),
        }
      })

      try {
        const result = await habitsApi.toggle(habitId, date)
        if (result.completed) {
          setSuccess(
            result.pointsEarned > 0
              ? `Nice! +${result.pointsEarned} wellness point${result.pointsEarned === 1 ? "" : "s"}`
              : "Checked in",
          )
        }
        // Server recomputes streaks/rates; refresh quietly.
        await fetchHabits(date)
        setError(null)
      } catch (err) {
        // Roll back the optimistic flip on failure.
        setHabits((prev) =>
          prev.map((h) => (h._id === habitId ? { ...h, completedDates: snapshotCompleted } : h)),
        )
        if (snapshotSummary) setSummary(snapshotSummary)
        setError(getErrorMessage(err))
        setSuccess(null)
      } finally {
        pendingTogglesRef.current.delete(`${habitId}:${date}`)
      }
    },
    [fetchHabits, habits, summary],
  )

  const openCreateDialog = useCallback(() => {
    setEditingHabit(null)
    setDialogOpen(true)
    setError(null)
  }, [])

  const openEditDialog = useCallback((habit: HabitWithProgress) => {
    setEditingHabit(habit)
    setDialogOpen(true)
    setError(null)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
    setEditingHabit(null)
    setError(null)
  }, [])

  const saveHabit = useCallback(
    async (payload: HabitPayload) => {
      try {
        setSaving(true)
        setError(null)
        if (editingHabit) {
          await habitsApi.update(editingHabit._id, payload)
          setSuccess("Habit updated")
        } else {
          await habitsApi.create(payload)
          setSuccess("Habit created")
        }
        setDialogOpen(false)
        setEditingHabit(null)
        await fetchHabits(viewDate)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSaving(false)
      }
    },
    [editingHabit, fetchHabits, viewDate],
  )

  const removeHabit = useCallback(
    async (id: string) => {
      try {
        await habitsApi.remove(id)
        setSuccess("Habit deleted")
        await fetchHabits(viewDate)
      } catch (err) {
        setError(getErrorMessage(err))
      }
    },
    [fetchHabits, viewDate],
  )

  const setArchived = useCallback(
    async (habit: HabitWithProgress, active: boolean) => {
      try {
        await habitsApi.update(habit._id, { active })
        setSuccess(active ? "Habit restored" : "Habit archived")
        await fetchHabits(viewDate)
      } catch (err) {
        setError(getErrorMessage(err))
      }
    },
    [fetchHabits, viewDate],
  )

  const shiftDate = useCallback(
    (delta: number) => {
      const d = new Date(`${viewDate}T00:00:00`)
      d.setDate(d.getDate() + delta)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      setViewDate(key)
      void fetchHabits(key)
    },
    [viewDate, fetchHabits],
  )

  return {
    habits,
    summary,
    loading,
    loadError,
    viewDate,
    showArchived,
    setShowArchived,
    dialogOpen,
    editingHabit,
    saving,
    error,
    success,
    setError,
    fetchHabits,
    toggleHabit,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    saveHabit,
    removeHabit,
    setArchived,
    shiftDate,
  }
}
