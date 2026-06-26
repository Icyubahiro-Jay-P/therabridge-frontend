import { ExerciseModal } from "@/components/exercises/ExerciseModal"
import { useHomeState } from "./components/home/useHomeState"
import { GreetingHeader } from "./components/home/GreetingHeader"
import { ResourcesSection } from "./components/home/ResourcesSection"
import { UpcomingAppointments } from "./components/home/UpcomingAppointments"
import { TherapistList } from "./components/home/TherapistList"
import { Zap, TrendingUp, Flame, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export function HomePage() {
  const {
    user, exercises, logs, loading, error, activeExercise, scoreStreak,
    showCompleted, setActiveExercise, setShowCompleted,
    completedExerciseIds, displayedExercises,
  } = useHomeState()

  if (!user) return null

  const streakCards = scoreStreak && [
    { label: "EX Score", value: scoreStreak.exerciseScore, Icon: Zap, border: "border-amber-200 dark:border-amber-900/50", bg: "bg-amber-50 dark:bg-amber-950/20", icon: "text-amber-500", labelC: "text-amber-600 dark:text-amber-400", valC: "text-amber-700 dark:text-amber-300" },
    { label: "Exercise Streak", value: `${scoreStreak.exerciseStreak} days`, Icon: TrendingUp, border: "border-emerald-200 dark:border-emerald-900/50", bg: "bg-emerald-50 dark:bg-emerald-950/20", icon: "text-emerald-500", labelC: "text-emerald-600 dark:text-emerald-400", valC: "text-emerald-700 dark:text-emerald-300" },
    { label: "Login Streak", value: `${scoreStreak.loginStreak} days`, Icon: Flame, border: "border-sky-200 dark:border-sky-900/50", bg: "bg-sky-50 dark:bg-sky-950/20", icon: "text-sky-500", labelC: "text-sky-600 dark:text-sky-400", valC: "text-sky-700 dark:text-sky-300" },
    { label: "Best Streak", value: `${Math.max(scoreStreak.longestLoginStreak, scoreStreak.longestExerciseStreak)} days`, Icon: Layers, border: "border-violet-200 dark:border-violet-900/50", bg: "bg-violet-50 dark:bg-violet-950/20", icon: "text-violet-500", labelC: "text-violet-600 dark:text-violet-400", valC: "text-violet-700 dark:text-violet-300" },
  ]

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

        {streakCards && (
          <section className="grid gap-4 sm:grid-cols-4">
            {streakCards.map(({ label, value, Icon, border, bg, icon, labelC, valC }) => (
              <div key={label} className={cn("flex items-center gap-3 rounded-2xl border p-4", border, bg)}>
                <Icon className={cn("size-6", icon)} />
                <div>
                  <p className={cn("text-xs", labelC)}>{label}</p>
                  <p className={cn("text-xl font-bold", valC)}>{value}</p>
                </div>
              </div>
            ))}
          </section>
        )}

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
