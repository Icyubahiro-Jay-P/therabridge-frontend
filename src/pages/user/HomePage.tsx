import { ExerciseModal } from "@/components/exercises/ExerciseModal"
import { useHomeState } from "./components/home/useHomeState"
import { GreetingHeader } from "./components/home/GreetingHeader"
import { ResourcesSection } from "./components/home/ResourcesSection"
import { UpcomingAppointments } from "./components/home/UpcomingAppointments"
import { TherapistList } from "./components/home/TherapistList"
import { StreakCards } from "./components/home/StreakCards"

export function HomePage() {
  const {
    user, exercises, logs, loading, error, activeExercise, scoreStreak,
    showCompleted, setActiveExercise, setShowCompleted,
    completedExerciseIds, displayedExercises,
  } = useHomeState()

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
        <GreetingHeader user={user} />

        {scoreStreak && <StreakCards scoreStreak={scoreStreak} />}

        <ResourcesSection
          exercises={exercises}
          displayedExercises={displayedExercises}
          loading={loading}
          error={error}
          showCompleted={showCompleted}
          completedExerciseIds={completedExerciseIds}
          onToggleShowCompleted={() => setShowCompleted(!showCompleted)}
          onStartExercise={setActiveExercise}
        />

        <UpcomingAppointments logs={logs} />
        <TherapistList user={user} />
      </div>
    </>
  )
}
