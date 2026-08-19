import { useState, useCallback } from "react"
import { assessmentApi, type Assessment, type AssessmentTrend } from "@/lib/assessment-api"

export function useAssessmentState() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [trend, setTrend] = useState<AssessmentTrend | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<Assessment | null>(null)
  const [total, setTotal] = useState(0)

  const fetchAssessments = useCallback(async (type?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await assessmentApi.list(type ? { type } : undefined)
      setAssessments(res.assessments)
      setTotal(res.total)
    } catch {
      setError("Failed to load assessments")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrend = useCallback(async (type: string) => {
    try {
      const res = await assessmentApi.trend(type)
      setTrend(res)
    } catch {
      // non-critical
    }
  }, [])

  const takeAssessment = useCallback(async (type: string, responses: { questionIndex: number; value: number }[]) => {
    setSaving(true)
    setError(null)
    try {
      const result = await assessmentApi.take({ type, responses })
      setLastResult(result)
      fetchAssessments()
      return result
    } catch {
      setError("Failed to save assessment")
      return null
    } finally {
      setSaving(false)
    }
  }, [fetchAssessments])

  const deleteAssessment = useCallback(async (id: string) => {
    try {
      await assessmentApi.delete(id)
      setAssessments((prev) => prev.filter((a) => a._id !== id))
      setTotal((prev) => prev - 1)
    } catch {
      setError("Failed to delete assessment")
    }
  }, [])

  return {
    assessments, trend, loading, saving, error, lastResult, total,
    fetchAssessments, fetchTrend, takeAssessment, deleteAssessment,
    clearLastResult: () => setLastResult(null),
    clearError: () => setError(null),
  }
}
