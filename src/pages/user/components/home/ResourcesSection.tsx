import { CheckCircle2, TriangleAlert } from "lucide-react"

import type { Exercise } from "@/components/exercises/types"
import { cn } from "@/lib/utils"

import { ResourceCard } from "./ResourceCard"

interface ResourcesSectionProps {
  exercises: Exercise[]
  displayedExercises: Exercise[]
  loading: boolean
  error: string | null
  showCompleted: boolean
  completedExerciseIds: Set<string>
  onToggleShowCompleted: () => void
  onStartExercise: (exercise: Exercise) => void
}

export function ResourcesSection({
  exercises,
  displayedExercises,
  loading,
  error,
  showCompleted,
  completedExerciseIds,
  onToggleShowCompleted,
  onStartExercise,
}: ResourcesSectionProps) {
  return (
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
        {exercises.length > 0 && (
          <button
            onClick={onToggleShowCompleted}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              showCompleted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            )}
          >
            <CheckCircle2 className="size-3.5" />
            {showCompleted ? "Hide completed" : `Show completed (${completedExerciseIds.size})`}
          </button>
        )}
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
          {displayedExercises.map((ex) => (
            <ResourceCard
              key={ex._id}
              exercise={ex}
              onStart={() => onStartExercise(ex)}
              completed={completedExerciseIds.has(ex._id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
