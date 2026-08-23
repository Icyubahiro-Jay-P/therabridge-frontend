import { ArrowLeft, CheckCircle2, Circle, BookOpen, Pencil, Dumbbell, ClipboardCheck, ChevronDown, ChevronRight, Trophy } from "lucide-react"
import { useProgramState } from "./useProgramState"
import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { ProgramWeek, ProgramActivity } from "@/lib/program-api"

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  reading: <BookOpen className="size-4" />,
  reflection: <Pencil className="size-4" />,
  exercise: <Dumbbell className="size-4" />,
  checkin: <ClipboardCheck className="size-4" />,
}

const ACTIVITY_COLORS: Record<string, string> = {
  reading: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  reflection: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  exercise: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  checkin: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
}

const CATEGORY_COLORS: Record<string, string> = {
  anxiety: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  mood: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  stress: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  sleep: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  resilience: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
}

function isActivityCompleted(
  weekIndex: number,
  activityIndex: number,
  completedActivities: { weekIndex: number; activityIndex: number }[],
) {
  return completedActivities.some(
    (a) => a.weekIndex === weekIndex && a.activityIndex === activityIndex,
  )
}

function ActivityViewer({
  activity,
  isCompleted,
  onComplete,
  onBack,
}: {
  activity: ProgramActivity
  isCompleted: boolean
  onComplete: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to program
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-4">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ACTIVITY_COLORS[activity.type]}`}>
            {ACTIVITY_ICONS[activity.type]}
            <span className="ml-1 capitalize">{activity.type}</span>
          </span>
          <span className="text-xs text-gray-400">{activity.duration}</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {activity.title}
        </h2>

        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {activity.description}
        </div>

        <div className="mt-6">
          {isCompleted ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              Activity completed
            </div>
          ) : (
            <button
              onClick={onComplete}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function WeekSection({
  week,
  weekIndex,
  completedActivities,
  completedWeeks,
  isCurrentWeek,
}: {
  week: ProgramWeek
  weekIndex: number
  completedActivities: { weekIndex: number; activityIndex: number }[]
  completedWeeks: number[]
  isCurrentWeek: boolean
}) {
  const [expanded, setExpanded] = useState(isCurrentWeek)
  const completedCount = week.activities.filter((_, i) =>
    isActivityCompleted(weekIndex, i, completedActivities),
  ).length
  const isWeekComplete = completedWeeks.includes(weekIndex)
  const progressPct = week.activities.length > 0 ? Math.round((completedCount / week.activities.length) * 100) : 0

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        isWeekComplete
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
          : isCurrentWeek
            ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/20"
            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            isWeekComplete
              ? "bg-emerald-500 text-white"
              : isCurrentWeek
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {isWeekComplete ? (
            <CheckCircle2 className="size-4" />
          ) : (
            weekIndex + 1
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {week.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {completedCount}/{week.activities.length} activities
          </p>
        </div>
        {progressPct > 0 && !isWeekComplete && (
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
        {expanded ? (
          <ChevronDown className="size-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="space-y-2 px-4 pb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {week.description}
          </p>
          {week.activities.map((activity, activityIndex) => {
            const done = isActivityCompleted(weekIndex, activityIndex, completedActivities)
            return (
              <div
                key={activity._id}
                className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                  done
                    ? "bg-emerald-50 dark:bg-emerald-950/30"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="size-4 shrink-0 text-gray-300 dark:text-gray-600" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${done ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${ACTIVITY_COLORS[activity.type]} rounded-full px-1.5 py-0.5`}>
                      {activity.type}
                    </span>
                    <span className="text-xs text-gray-400">{activity.duration}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ProgramDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const p = useProgramState()
  const initializedRef = useRef(false)
  const [activeActivity, setActiveActivity] = useState<{
    weekIndex: number
    activityIndex: number
  } | null>(null)

  useEffect(() => {
    if (!initializedRef.current && id) {
      initializedRef.current = true
      p.fetchProgram(id)
    }
  })

  const handleStart = async () => {
    if (!id) return
    await p.startProgram(id)
    await p.fetchProgram(id)
  }

  const handleCompleteActivity = async () => {
    if (!id || !activeActivity) return
    const result = await p.completeActivity(
      id,
      activeActivity.weekIndex,
      activeActivity.activityIndex,
    )
    if (result) {
      await p.fetchProgram(id)
      setActiveActivity(null)
    }
  }

  const program = p.activeProgram
  const progress = p.activeProgress

  if (p.loading && !program) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-72 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-32 w-full rounded-2xl bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Program not found</p>
        <button
          onClick={() => navigate("/programs")}
          className="mt-4 text-sm font-medium text-emerald-600 hover:underline"
        >
          Back to programs
        </button>
      </div>
    )
  }

  if (activeActivity && program.weeks[activeActivity.weekIndex]) {
    const activity =
      program.weeks[activeActivity.weekIndex].activities[
        activeActivity.activityIndex
      ]
    if (!activity) {
      setActiveActivity(null)
      return null
    }
    return (
      <div className="mx-auto max-w-2xl p-6">
        {p.error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {p.error}
          </div>
        )}
        <ActivityViewer
          activity={activity}
          isCompleted={isActivityCompleted(
            activeActivity.weekIndex,
            activeActivity.activityIndex,
            progress?.completedActivities ?? [],
          )}
          onComplete={handleCompleteActivity}
          onBack={() => setActiveActivity(null)}
        />
      </div>
    )
  }

  const completedWeeks = progress?.completedWeeks ?? []
  const completedActivities = progress?.completedActivities ?? []
  const totalActivities = program.weeks.reduce(
    (sum, w) => sum + w.activities.length,
    0,
  )
  const completedCount = completedActivities.length
  const percentage = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0
  const isProgramComplete = percentage === 100 && totalActivities > 0

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <button
        onClick={() => navigate("/programs")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" />
        All programs
      </button>

      {p.success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {p.success}
        </div>
      )}

      {/* Program Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[program.category] ?? ""}`}
          >
            {program.category}
          </span>
          <span className="text-xs text-gray-400">{program.duration}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {program.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {program.description}
        </p>

        {/* Progress */}
        {progress && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                {isProgramComplete ? (
                  <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Trophy className="size-4" />
                    Program Complete!
                  </span>
                ) : (
                  <>
                    Week {(progress.currentWeek ?? 0) + 1} of {program.weeks.length}
                  </>
                )}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {completedCount}/{totalActivities} ({percentage}%)
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-full rounded-full transition-all ${isProgramComplete ? "bg-emerald-500" : "bg-emerald-500"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {!progress && (
          <button
            onClick={handleStart}
            className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Start This Program
          </button>
        )}

        {isProgramComplete && (
          <div className="mt-5 rounded-xl bg-linear-to-r from-emerald-50 to-emerald-50 p-4 text-center dark:from-emerald-950/30 dark:to-emerald-950/30">
            <Trophy className="mx-auto mb-2 size-8 text-emerald-500" />
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              Congratulations!
            </p>
            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-500">
              You completed all {totalActivities} activities across {program.weeks.length} weeks.
            </p>
          </div>
        )}
      </div>

      {/* Weeks */}
      {progress && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Breakdown
          </h2>
          {program.weeks.map((week, weekIndex) => (
            <WeekSection
              key={week._id}
              week={week}
              weekIndex={weekIndex}
              completedActivities={completedActivities}
              completedWeeks={completedWeeks}
              isCurrentWeek={progress.currentWeek === weekIndex}
            />
          ))}
        </div>
      )}

      {!progress && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Breakdown
          </h2>
          {program.weeks.map((week, weekIndex) => (
            <div
              key={week._id}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  {weekIndex + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {week.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {week.activities.length} activities
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {week.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
