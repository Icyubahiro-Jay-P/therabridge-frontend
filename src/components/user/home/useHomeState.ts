import { useEffect, useState } from "react"
import type { Exercise } from "@/components/user/exercises/types"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"

export interface ExerciseLogEntry {
  _id: string
  exercise: {
    _id: string
    title: string
    emoji: string
    color: string
    type: string
    duration: number
  }
  completed: boolean
  completedAt: string
  timeSpent: number
}

interface ScoreStreak {
  exerciseScore: number
  loginStreak: number
  exerciseStreak: number
  longestLoginStreak: number
  longestExerciseStreak: number
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function useHomeState() {
  const user = useAuthStore((state) => state.user)

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [logs, setLogs] = useState<ExerciseLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)
  const [scoreStreak, setScoreStreak] = useState<ScoreStreak | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [exRes, logsRes] = await Promise.all([
          api.get<Exercise[]>("/api/exercises"),
          api
            .get<ExerciseLogEntry[]>("/api/exercises/logs/mine")
            .catch(() => ({ data: [] })),
        ])
        setExercises(exRes.data)
        setLogs(logsRes.data)
      } catch {
        setError("Could not load exercises. Make sure the backend is running.")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    async function fetchScoreStreak() {
      if (!user) return
      try {
        const { data } = await api.get("/api/exercises/stats")
        setScoreStreak({
          exerciseScore: data.exerciseScore ?? 0,
          loginStreak: data.loginStreak ?? 0,
          exerciseStreak: data.exerciseStreak ?? 0,
          longestLoginStreak: data.longestLoginStreak ?? 0,
          longestExerciseStreak: data.longestExerciseStreak ?? 0,
        })
      } catch {
        setScoreStreak({
          exerciseScore: user.exerciseScore ?? 0,
          loginStreak: user.loginStreak ?? 0,
          exerciseStreak: user.exerciseStreak ?? 0,
          longestLoginStreak: user.longestLoginStreak ?? 0,
          longestExerciseStreak: user.longestExerciseStreak ?? 0,
        })
      }
    }
    void fetchScoreStreak()
  }, [user])

  const completedExerciseIds = new Set(
    logs.filter((l) => l.completed).map((l) => l.exercise._id)
  )

  const displayedExercises = showCompleted
    ? exercises
    : exercises.filter((ex) => !completedExerciseIds.has(ex._id))

  return {
    user,
    exercises,
    logs,
    loading,
    error,
    activeExercise,
    scoreStreak,
    showCompleted,
    setActiveExercise,
    setShowCompleted,
    completedExerciseIds,
    displayedExercises,
  }
}
