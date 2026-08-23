import { useState, useCallback } from "react"
import { activityApi, type Activity, type ActivityStats } from "@/lib/activity-api"
import { getErrorMessage } from "@/lib/errors"
import { runOptimistic } from "@/lib/optimistic"

export function useActivityState() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchActivities = useCallback(async (params?: { week?: string; completed?: boolean; category?: string }) => {
    setLoading(true)
    try {
      const res = await activityApi.list(params)
      setActivities(res.activities)
    } catch {
      setError("Failed to load activities")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await activityApi.stats()
      setStats(res)
    } catch {
      // non-critical
    }
  }, [])

  const createActivity = useCallback(async (data: Parameters<typeof activityApi.create>[0]) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const activity = await activityApi.create(data)
      setActivities((prev) => [...prev, activity].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()))
      fetchStats()
      setSuccess("Activity scheduled!")
      return activity
    } catch {
      setError("Failed to create activity")
      return null
    } finally {
      setSaving(false)
    }
  }, [fetchStats])

  const completeActivity = useCallback(async (id: string, data?: { actualPleasure?: number; moodAfter?: string; notes?: string }) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const completed = await activityApi.complete(id, data)
      setActivities((prev) => prev.map((a) => (a._id === id ? completed : a)))
      fetchStats()
      setSuccess(completed.pointsEarned ? `Activity completed! +${completed.pointsEarned} wellness points` : "Activity completed!")
      return completed
    } catch {
      setError("Failed to complete activity")
      return null
    } finally {
      setSaving(false)
    }
  }, [fetchStats])

  const deleteActivity = useCallback(async (id: string) => {
    try {
      await activityApi.delete(id)
      setActivities((prev) => prev.filter((a) => a._id !== id))
      fetchStats()
    } catch {
      setError("Failed to delete activity")
    }
  }, [fetchStats])

  return {
    activities, stats, loading, saving, error, success,
    fetchActivities, fetchStats, createActivity, completeActivity, deleteActivity,
    clearMessages: () => { setError(null); setSuccess(null) },
  }
}
