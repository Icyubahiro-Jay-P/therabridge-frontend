import {
  Activity,
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
}: {
  exercise: Exercise
  onStart: () => void
}) {
  const TypeIcon = typeIcons[exercise.type] ?? Sparkles

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900">
      <div className="h-1.5 w-full" style={{ background: exercise.color }} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <TypeIcon className="size-7" color={exercise.color} />
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
