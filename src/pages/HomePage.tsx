import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageCircle,
  Play,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ExerciseStep {
  instruction: string
  duration?: number
}

interface Exercise {
  _id: string
  title: string
  description: string
  duration: number
  type: string
  steps: ExerciseStep[]
  difficulty: string
  emoji: string
  color: string
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m} min`
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

// ──────────────────────────────────────────────────────────────────────────────
// Exercise Modal (guided exercise)
// ──────────────────────────────────────────────────────────────────────────────

function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const currentStep = exercise.steps[step]

  // Countdown timer for the current step
  useEffect(() => {
    if (!currentStep?.duration) {
      setTimeLeft(null)
      return
    }
    setTimeLeft(currentStep.duration)
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step, currentStep?.duration])

  function advance() {
    if (step < exercise.steps.length - 1) {
      setStep((s) => s + 1)
    } else {
      setDone(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div
          className="rounded-t-2xl p-6 text-white"
          style={{ background: `linear-gradient(135deg, ${exercise.color}dd, ${exercise.color}99)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-1.5 hover:bg-white/30"
          >
            <X className="size-4" />
          </button>
          <div className="mb-1 text-3xl">{exercise.emoji}</div>
          <h2 className="text-xl font-bold">{exercise.title}</h2>
          <p className="mt-1 text-sm text-white/80">
            {exercise.steps.length} steps · {formatDuration(exercise.duration)}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {done ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="size-16 text-emerald-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Well done! 🎉
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You completed <strong>{exercise.title}</strong>. Take a moment
                to notice how you feel right now.
              </p>
              <Button onClick={onClose} className="mt-2 bg-emerald-600 hover:bg-emerald-700">
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* Progress dots */}
              <div className="mb-5 flex gap-1.5">
                {exercise.steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all",
                      i <= step ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                ))}
              </div>

              <p className="mb-1 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Step {step + 1} of {exercise.steps.length}
              </p>

              <p className="mb-6 text-lg font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
                {currentStep.instruction}
              </p>

              {/* Timer */}
              {timeLeft !== null && (
                <div className="mb-6 flex items-center justify-center">
                  <div
                    className="flex size-20 flex-col items-center justify-center rounded-full border-4 text-xl font-bold"
                    style={{ borderColor: exercise.color, color: exercise.color }}
                  >
                    {timeLeft}s
                  </div>
                </div>
              )}

              <Button
                onClick={advance}
                className="w-full font-semibold"
                style={{ background: exercise.color }}
              >
                {step < exercise.steps.length - 1 ? (
                  <>
                    Next step <ChevronRight className="size-4" />
                  </>
                ) : (
                  <>
                    Finish <CheckCircle2 className="size-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Exercise Card
// ──────────────────────────────────────────────────────────────────────────────

function ExerciseCard({
  exercise,
  onStart,
}: {
  exercise: Exercise
  onStart: () => void
}) {
  const typeLabels: Record<string, string> = {
    breathing: "Breathing",
    mindfulness: "Mindfulness",
    gratitude: "Gratitude",
    grounding: "Grounding",
    movement: "Movement",
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900">
      {/* Color accent */}
      <div
        className="h-1.5 w-full"
        style={{ background: exercise.color }}
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between">
          <span className="text-3xl">{exercise.emoji}</span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ background: exercise.color + "cc" }}
          >
            {typeLabels[exercise.type] ?? exercise.type}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {exercise.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {exercise.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(exercise.duration)}
          </span>
          <span className="capitalize">{exercise.difficulty}</span>
        </div>

        <Button
          onClick={onStart}
          size="sm"
          className="mt-auto w-full font-medium transition-all"
          style={{ background: exercise.color }}
        >
          <Play className="size-3.5" /> Start exercise
        </Button>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// HomePage
// ──────────────────────────────────────────────────────────────────────────────

export function HomePage() {
  const user = useAuthStore((state) => state.user)

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<Exercise[]>("/api/exercises")
        setExercises(data)
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
      {/* Exercise modal overlay */}
      {activeExercise && (
        <ExerciseModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
        />
      )}

      <div className="space-y-10">
        {/* ── Hero banner ── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-8 text-white shadow-xl shadow-emerald-700/20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 size-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-white/5" />
          </div>
          <div className="relative">
            <p className="text-sm font-medium text-emerald-200">
              {getGreeting()} 👋
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
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link to="/profile">
                  View Profile <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Exercises section ── */}
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
              ⚠️ {error}
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

        {/* ── Quick stats ── */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Member since",
              value: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
                : "Today",
              icon: "🗓️",
            },
            {
              label: "Account role",
              value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
              icon: "🧩",
            },
            {
              label: "Username",
              value: `@${user.username}`,
              icon: "✨",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900"
            >
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
