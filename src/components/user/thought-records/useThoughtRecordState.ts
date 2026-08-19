import { useState, useCallback } from "react"
import { thoughtRecordApi, type ThoughtRecord, type ThoughtRecordStats } from "@/lib/thoughtRecord-api"

export function useThoughtRecordState() {
  const [records, setRecords] = useState<ThoughtRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<ThoughtRecord | null>(null)
  const [stats, setStats] = useState<ThoughtRecordStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [filterDistortion, setFilterDistortion] = useState<string | null>(null)
  const [filterMood, setFilterMood] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchRecords = useCallback(async (opts?: { page?: number; distortion?: string | null; mood?: string | null; search?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const p = opts?.page ?? page
      const d = opts?.distortion ?? filterDistortion
      const m = opts?.mood ?? filterMood
      const s = opts?.search ?? searchQuery
      const params: Record<string, string | number> = { page: p, limit: 20 }
      if (d) params.distortion = d
      if (m) params.mood = m
      if (s) params.search = s
      const res = await thoughtRecordApi.list(params)
      setRecords((prev) => (p === 1 ? res.records : [...prev, ...res.records]))
      setHasMore(res.hasMore)
      setPage(p)
    } catch {
      setError("Failed to load thought records")
    } finally {
      setLoading(false)
    }
  }, [page, filterDistortion, filterMood, searchQuery])

  const fetchStats = useCallback(async () => {
    try {
      const res = await thoughtRecordApi.stats()
      setStats(res)
    } catch {
      // non-critical
    }
  }, [])

  const createRecord = useCallback(async (data: {
    situation: string
    automaticThought: string
    emotions: string
    emotionIntensity: number
    distortionType?: string
    evidenceFor?: string
    evidenceAgainst?: string
    reframe: string
    outcomeEmotion?: string
    outcomeIntensity?: number
    mood?: string
  }) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const record = await thoughtRecordApi.create(data)
      setRecords((prev) => [record, ...prev])
      fetchStats()
      setSuccess(record.pointsEarned ? `Thought record saved! +${record.pointsEarned} wellness points` : "Thought record saved!")
      return record
    } catch {
      setError("Failed to save thought record")
      return null
    } finally {
      setSaving(false)
    }
  }, [fetchStats])

  const updateRecord = useCallback(async (id: string, data: Partial<{
    situation: string
    automaticThought: string
    emotions: string
    emotionIntensity: number
    distortionType: string
    evidenceFor: string
    evidenceAgainst: string
    reframe: string
    outcomeEmotion: string
    outcomeIntensity: number
    mood: string
  }>) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await thoughtRecordApi.update(id, data)
      setRecords((prev) => prev.map((r) => (r._id === id ? updated : r)))
      if (selectedRecord?._id === id) setSelectedRecord(updated)
      setSuccess("Thought record updated!")
      return updated
    } catch {
      setError("Failed to update thought record")
      return null
    } finally {
      setSaving(false)
    }
  }, [selectedRecord])

  const deleteRecord = useCallback(async (id: string) => {
    setError(null)
    try {
      await thoughtRecordApi.delete(id)
      setRecords((prev) => prev.filter((r) => r._id !== id))
      if (selectedRecord?._id === id) setSelectedRecord(null)
      fetchStats()
    } catch {
      setError("Failed to delete thought record")
    }
  }, [selectedRecord, fetchStats])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchRecords({ page: page + 1 })
    }
  }, [loading, hasMore, page, fetchRecords])

  return {
    records, selectedRecord, setSelectedRecord, stats,
    loading, saving, error, success, hasMore,
    filterDistortion, setFilterDistortion,
    filterMood, setFilterMood,
    searchQuery, setSearchQuery,
    fetchRecords, fetchStats, createRecord, updateRecord, deleteRecord, loadMore,
    clearMessages: () => { setError(null); setSuccess(null) },
  }
}
