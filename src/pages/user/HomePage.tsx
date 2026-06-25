import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  MessageCircle,
  Puzzle,
  Sparkles,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ExerciseCard } from "@/components/exercises/ExerciseCard"
import { ExerciseModal } from "@/components/exercises/ExerciseModal"
import type { Exercise } from "@/components/exercises/types"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"

interface ExerciseLogEntry {
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

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function HomePage() {
  const user = useAuthStore((state) => state.user)

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [logs, setLogs] = useState<ExerciseLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [exRes, logsRes] = await Promise.all([
          api.get<Exercise[]>("/api/exercises"),
          api.get<ExerciseLogEntry[]>("/api/exercises/logs/mine").catch(() => ({ data: [] })),
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

  if (!user) return null

  return (
    <>
      {activeExercise && (
        <ExerciseModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
        />
      )}

      <div className="space-y-10 p-6">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700 p-8 text-white shadow-xl shadow-emerald-700/20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 size-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-white/5" />
          </div>
          <div className="relative">
            <p className="text-sm font-medium text-emerald-200">
              {getGreeting()}
            </p>
            <h1 className="mt-1.5 text-3xl font-bold tracking-tight">
              Hi, {user.firstName}!
            </h1>
            <p className="mt-2 max-w-xl text-emerald-100">
              Take a moment for yourself today. Choose a guided exercise below
              to help you breathe, ground, and feel better.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="font-semibold">
                <Link to="/chat">
                  <MessageCircle className="size-4" />
                  Open Chat
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <Link to="/profile">
                  View Profile <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Wellness Exercises
              </h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Guided practices to calm your mind and body
              </p>
            </div>
          </div>

          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="inline size-4 shrink-0" /> {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exercises.map((ex) => (
                <ExerciseCard
                  key={ex._id}
                  exercise={ex}
                  onStart={() => setActiveExercise(ex)}
                />
              ))}
            </div>
          )}
        </section>

        {logs.filter((l) => l.completed).length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Flame className="size-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent completions
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {logs
                .filter((l) => l.completed)
                .slice(0, 10)
                .map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="size-3" />
                    <span>{log.exercise.emoji} {log.exercise.title}</span>
                    {log.completedAt && (
                      <span className="text-emerald-400 dark:text-emerald-500">
                        {new Date(log.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          {([
            {
              label: "Member since",
              value: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })
                : "Today",
              Icon: CalendarDays,
            },
            {
              label: "Account role",
              value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
              Icon: Puzzle,
            },
            {
              label: "Username",
              value: `@${user.username}`,
              Icon: Sparkles,
            },
          ] as const).map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900"
            >
              <Icon className="size-7 text-gray-500 dark:text-gray-400" />
                <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {label}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
