import { useState, useCallback } from "react"
import {
  programApi,
  type Program,
  type ProgramListItem,
  type ProgramProgress,
  type CompleteActivityResponse,
} from "@/lib/program-api"

export function useProgramState() {
  const [programs, setPrograms] = useState<ProgramListItem[]>([])
  const [myInProgress, setMyInProgress] = useState<ProgramListItem[]>([])
  const [myCompleted, setMyCompleted] = useState<ProgramListItem[]>([])
  const [activeProgram, setActiveProgram] = useState<Program | null>(null)
  const [activeProgress, setActiveProgress] = useState<ProgramProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchPrograms = useCallback(async (category?: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await programApi.list(category)
      setPrograms(result)
    } catch {
      setError("Failed to load programs")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMyPrograms = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await programApi.myPrograms()
      setMyInProgress(result.inProgress)
      setMyCompleted(result.completed)
    } catch {
      setError("Failed to load your programs")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProgram = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await programApi.get(id)
      setActiveProgram(result.program)
      setActiveProgress(result.progress)
      return result
    } catch {
      setError("Failed to load program")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const startProgram = useCallback(async (id: string) => {
    setError(null)
    try {
      const progress = await programApi.start(id)
      setActiveProgress(progress)
      return progress
    } catch {
      setError("Failed to start program")
      return null
    }
  }, [])

  const completeActivity = useCallback(
    async (id: string, weekIndex: number, activityIndex: number) => {
      setError(null)
      setSuccess(null)
      try {
        const result: CompleteActivityResponse = await programApi.completeActivity(
          id,
          weekIndex,
          activityIndex,
        )
        setActiveProgress(result.progress)

        if (result.weekCompleted) {
          setSuccess(
            `Week completed! +${result.pointsEarned} wellness points`,
          )
        } else if (result.percentage === 100) {
          setSuccess("Program completed! Congratulations!")
        }

        return result
      } catch {
        setError("Failed to record completion")
        return null
      }
    },
    [],
  )

  return {
    programs,
    myInProgress,
    myCompleted,
    activeProgram,
    activeProgress,
    loading,
    error,
    success,
    fetchPrograms,
    fetchMyPrograms,
    fetchProgram,
    startProgram,
    completeActivity,
    clearMessages: () => {
      setError(null)
      setSuccess(null)
    },
  }
}
