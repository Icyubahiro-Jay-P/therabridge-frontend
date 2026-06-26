import { ExerciseCard } from "@/components/exercises/ExerciseCard"
import type { Exercise } from "@/components/exercises/types"

interface ResourceCardProps {
  exercise: Exercise
  onStart: () => void
  completed?: boolean
}

export function ResourceCard({ exercise, onStart, completed }: ResourceCardProps) {
  return (
    <ExerciseCard
      exercise={exercise}
      onStart={onStart}
      completed={completed}
    />
  )
}
