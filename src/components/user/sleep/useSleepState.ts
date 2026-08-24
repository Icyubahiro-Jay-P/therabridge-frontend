import { useState, useCallback } from "react"
import {
  sleepApi,
  type SleepLog,
  type SleepContent,
  type SleepStats,
} from "@/lib/sleep-api"

export function useSleepState() {
  const [logs, setLogs] = useState<SleepLog[]>([])
  const [content, setContent] = useState<SleepContent[]>([])
  const [stats, setStats] = useState<SleepStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await sleepApi.list({ page, limit: 20 })
      setLogs((prev) => (page === 1 ? res.data : [...prev, ...res.data]))
      setTotalPages(res.totalPages)
    } catch {
      setError("Failed to load sleep logs")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await sleepApi.stats()
      setStats(res)
    } catch {
      // non-critical
    }
  }, [])

  const fetchContent = useCallback(async (type?: string) => {
    try {
      const res = await sleepApi.content(type ? { type } : undefined)
      setContent(res.content)
    } catch {
      // non-critical
    } finally {
      setContentLoading(false)
    }
  }, [])

  const logSleepEntry = useCallback(async (data: Parameters<typeof sleepApi.log>[0]) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const entry = await sleepApi.log(data)
      setLogs((prev) => [entry, ...prev])
      fetchStats()
      setSuccess("Sleep logged!")
      return entry
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save"
      setError(msg || "Failed to save sleep log")
      return null
    } finally {
      setSaving(false)
    }
  }, [fetchStats])

  const deleteLogEntry = useCallback(async (id: string) => {
    try {
      await sleepApi.deleteLog(id)
      setLogs((prev) => prev.filter((l) => l._id !== id))
      fetchStats()
    } catch {
      setError("Failed to delete sleep log")
    }
  }, [fetchStats])

  return {
    logs,
    content,
    stats,
    loading,
    contentLoading,
    saving,
    error,
    success,
    totalPages,
    fetchLogs,
    fetchStats,
    fetchContent,
    logSleepEntry,
    deleteLogEntry,
    clearMessages: () => {
      setError(null)
      setSuccess(null)
    },
  }
}
