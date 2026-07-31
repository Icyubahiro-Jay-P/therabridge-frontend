import { ExerciseModal } from "@/components/user/exercises/ExerciseModal"
import { useHomeState } from "@/components/user/home/useHomeState"
import { GreetingHeader } from "@/components/user/home/GreetingHeader"
import { ResourcesSection } from "@/components/user/home/ResourcesSection"
import { UpcomingAppointments } from "@/components/user/home/UpcomingAppointments"
import { TherapistList } from "@/components/user/home/TherapistList"
import { StreakCards } from "@/components/user/home/StreakCards"

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
