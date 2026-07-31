import { ExerciseCard } from "@/components/user/exercises/ExerciseCard"
import type { Exercise } from "@/components/user/exercises/types"

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
