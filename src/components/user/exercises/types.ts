export interface ExerciseStep {
  instruction: string
  duration?: number
}

export interface Exercise {
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
