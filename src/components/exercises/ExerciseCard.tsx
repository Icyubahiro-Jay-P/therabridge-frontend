import {
  Activity,
  CheckCheck,
  Clock,
  Compass,
  Heart,
  Play,
  Sparkles,
  Wind,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Exercise } from "./types"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, LucideIcon> = {
  breathing: Wind,
  mindfulness: Sparkles,
  gratitude: Heart,
  movement: Activity,
  grounding: Compass,
}

const typeLabels: Record<string, string> = {
  breathing: "Breathing",
  mindfulness: "Mindfulness",
  gratitude: "Gratitude",
  grounding: "Grounding",
  movement: "Movement",
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m} min`
}

export function ExerciseCard({
  exercise,
  onStart,
  completed,
}: {
  exercise: Exercise
  onStart: () => void
  completed?: boolean
}) {
  const TypeIcon = typeIcons[exercise.type] ?? Sparkles

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 dark:bg-gray-900",
        completed
          ? "border-emerald-300 opacity-75 dark:border-emerald-800"
          : "border-gray-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-700/60"
      )}
    >
      <div className="h-1.5 w-full" style={{ background: exercise.color }} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <div className="relative">
            <TypeIcon className="size-7" color={exercise.color} />
            {completed && (
              <span className="absolute -top-1 -right-1">
                <CheckCheck className="size-3.5 text-emerald-500" />
              </span>
            )}
          </div>
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
          <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {exercise.description}
          </p>
        </div>

        <div className={cn(
          "flex items-center gap-3 text-xs dark:text-gray-500",
          completed ? "text-emerald-400" : "text-gray-400"
        )}>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(exercise.duration)}
          </span>
          <span className="capitalize">{exercise.difficulty}</span>
        </div>

        <Button
          onClick={completed ? undefined : onStart}
          size="sm"
          disabled={completed}
          className={cn(
            "mt-auto w-full font-medium transition-all",
            completed && "cursor-not-allowed opacity-60"
          )}
          style={{ background: completed ? undefined : exercise.color }}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <>
              <CheckCheck className="size-3.5" /> Completed
            </>
          ) : (
            <>
              <Play className="size-3.5" /> Start exercise
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
