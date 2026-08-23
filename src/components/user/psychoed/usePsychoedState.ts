import { useState, useCallback } from "react"
import {
  psychoedApi,
  type PsychoedModuleSummary,
  type PsychoedModuleDetail,
  type PsychoedProgress,
} from "@/lib/psychoed-api"

export function usePsychoedState() {
  const [modules, setModules] = useState<PsychoedModuleSummary[]>([])
  const [activeModule, setActiveModule] = useState<PsychoedModuleDetail | null>(null)
  const [activeProgress, setActiveProgress] = useState<PsychoedProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchModules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await psychoedApi.getModules()
      setModules(res.modules)
    } catch {
      setError("Failed to load modules")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchModule = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await psychoedApi.getModule(id)
      setActiveModule(res.module)
      setActiveProgress(res.progress)
      return res
    } catch {
      setError("Failed to load module")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const startModule = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      const progress = await psychoedApi.startModule(id)
      setActiveProgress(progress)
      setModules((prev) =>
        prev.map((m) =>
          m._id === id
            ? { ...m, progress: { currentStepIndex: progress.currentStepIndex, completedSteps: progress.completedSteps, completed: progress.completed, completedAt: null } }
            : m,
        ),
      )
      return progress
    } catch {
      setError("Failed to start module")
      return null
    } finally {
      setSaving(false)
    }
  }, [])

  const completeStep = useCallback(async (id: string, stepIndex: number) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const progress = await psychoedApi.completeStep(id, stepIndex)
      setActiveProgress(progress)
      setModules((prev) =>
        prev.map((m) =>
          m._id === id
            ? {
                ...m,
                progress: {
                  currentStepIndex: progress.currentStepIndex,
                  completedSteps: progress.completedSteps,
                  completed: progress.completed,
                  completedAt: progress.completedAt,
                },
              }
            : m,
        ),
      )
      if (progress.completed) {
        setSuccess("Module completed! Congratulations!")
      }
      return progress
    } catch {
      setError("Failed to save progress")
      return null
    } finally {
      setSaving(false)
    }
  }, [])

  const navigateToStep = useCallback((stepIndex: number) => {
    setActiveProgress((prev) => {
      if (!prev) return prev
      return { ...prev, currentStepIndex: stepIndex }
    })
  }, [])

  return {
    modules,
    activeModule,
    activeProgress,
    loading,
    saving,
    error,
    success,
    fetchModules,
    fetchModule,
    startModule,
    completeStep,
    navigateToStep,
    clearMessages: () => { setError(null); setSuccess(null) },
  }
}
