import { useEffect, useRef, useState } from "react"
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Compass,
  Heart,
  Loader2,
  Sparkles,
  Wind,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import type { Exercise } from "./types"

const typeIcons: Record<string, typeof Sparkles> = {
  breathing: Wind,
  mindfulness: Sparkles,
  gratitude: Heart,
  movement: Activity,
  grounding: Compass,
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m} min`
}

export function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [logId, setLogId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [sessionError, setSessionError] = useState("")
  const startTimeRef = useRef<number>(Date.now())

  const currentStep = exercise.steps[step]
  const TypeIcon = typeIcons[exercise.type] ?? Sparkles
  const stepReady = timeLeft === null || timeLeft <= 0
  const totalExerciseDuration = exercise.duration

  useEffect(() => {
    async function init() {
      try {
        const { data } = await api.post(`/api/exercises/${exercise._id}/start`)
        setLogId(data.logId)
        startTimeRef.current = Date.now()
      } catch {
        setSessionError("Could not start exercise session.")
      }
    }
    void init()
  }, [exercise._id])

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

  async function advance() {
    if (!stepReady) return

    if (step < exercise.steps.length - 1) {
      setStep((s) => s + 1)
    } else {
      setSaving(true)
      try {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
        await api.post(`/api/exercises/${exercise._id}/complete`, {
          logId,
          timeSpent,
        })
        setDone(true)
      } catch {
        setSessionError("Failed to save your progress. You can still close.")
        setDone(true)
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div
          className="rounded-t-2xl p-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${exercise.color}dd, ${exercise.color}99)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-1.5 hover:bg-white/30"
          >
            <X className="size-4" />
          </button>
          <TypeIcon className="mb-1 size-8" />
          <h2 className="text-xl font-bold">{exercise.title}</h2>
          <p className="mt-1 text-sm text-white/80">
            {exercise.steps.length} steps · {formatDuration(totalExerciseDuration)}
          </p>
        </div>

        <div className="p-6">
          {sessionError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              {sessionError}
            </p>
          )}

          {done ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="size-16 text-emerald-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Well done!
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You completed <strong>{exercise.title}</strong>. Take a moment
                to notice how you feel right now.
              </p>
              <Button
                onClick={onClose}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex gap-1.5">
                {exercise.steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all",
                      i <= step
                        ? "bg-emerald-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                ))}
              </div>

              <p className="mb-1 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                Step {step + 1} of {exercise.steps.length}
              </p>

              <p className="mb-6 text-lg leading-relaxed font-medium text-gray-800 dark:text-gray-100">
                {currentStep.instruction}
              </p>

              {timeLeft !== null && (
                <div className="mb-6 flex items-center justify-center">
                  <div
                    className="flex size-20 flex-col items-center justify-center rounded-full border-4 text-xl font-bold"
                    style={{
                      borderColor: exercise.color,
                      color: exercise.color,
                    }}
                  >
                    {timeLeft > 0 ? `${timeLeft}s` : "0s"}
                  </div>
                </div>
              )}

              {!stepReady && (
                <p className="mb-3 text-center text-xs text-gray-400">
                  Please wait for the timer...
                </p>
              )}

              <Button
                onClick={advance}
                disabled={!stepReady || saving}
                className="w-full font-semibold disabled:opacity-50"
                style={{ background: exercise.color }}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </span>
                ) : step < exercise.steps.length - 1 ? (
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
