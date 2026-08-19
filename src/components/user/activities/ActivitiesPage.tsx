import { Calendar, Plus, CheckCircle2, Circle, Trash2, TrendingUp } from "lucide-react"
import { useActivityState } from "./useActivityState"
import { ActivityEditor } from "./ActivityEditor"
import { CompleteActivityModal } from "./CompleteActivityModal"
import { useEffect, useRef, useState } from "react"
import { CATEGORIES } from "@/lib/activity-api"
import type { Activity } from "@/lib/activity-api"

const CATEGORY_COLORS: Record<string, string> = {
  social: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  physical: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  creative: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  productive: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  relaxation: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  outdoor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  learning: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
  self_care: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-950/40 dark:text-gray-400",
}

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]))

function getWeekStart(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export function ActivitiesPage() {
  const a = useActivityState()
  const initializedRef = useRef(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [completingActivity, setCompletingActivity] = useState<Activity | null>(null)
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()))

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      a.fetchActivities({ week: weekStart.toISOString() })
      a.fetchStats()
    }
  })

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
    a.fetchActivities({ week: d.toISOString() })
  }

  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
    a.fetchActivities({ week: d.toISOString() })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Planner</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Plan meaningful activities to boost your mood.
          </p>
        </div>
        <button
          onClick={() => setEditorOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="size-4" />
          Plan Activity
        </button>
      </div>

      {a.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          {a.success}
        </div>
      )}

      {/* Stats */}
      {a.stats && a.stats.totalActivities > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400">Planned</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{a.stats.totalActivities}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{a.stats.completedActivities}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400">Completion</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{a.stats.completionRate}%</p>
          </div>
        </div>
      )}

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevWeek} className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          &larr; Prev
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {formatDate(weekStart)} &ndash; {formatDate(weekEnd)}
        </span>
        <button onClick={nextWeek} className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          Next &rarr;
        </button>
      </div>

      {/* Day columns */}
      <div className="space-y-4">
        {days.map((day) => {
          const dayStr = day.toISOString().split("T")[0]
          const dayActivities = a.activities.filter(
            (act) => new Date(act.scheduledDate).toISOString().split("T")[0] === dayStr,
          )
          const isToday = day.getTime() === today.getTime()

          return (
            <div key={dayStr} className={`rounded-xl border ${isToday ? "border-emerald-300 dark:border-emerald-700" : "border-gray-200 dark:border-gray-700"} bg-white p-3 dark:bg-gray-900`}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-sm font-semibold ${isToday ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {formatDate(day)}
                  {isToday && <span className="ml-2 text-xs text-emerald-500">(Today)</span>}
                </span>
                <span className="text-xs text-gray-400">{dayActivities.length} activities</span>
              </div>
              {dayActivities.length === 0 ? (
                <p className="py-2 text-xs text-gray-400 dark:text-gray-500">No activities planned</p>
              ) : (
                <div className="space-y-2">
                  {dayActivities.map((act) => (
                    <div
                      key={act._id}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${act.completed ? "bg-green-50 dark:bg-green-950/20" : "bg-gray-50 dark:bg-gray-800"}`}
                    >
                      <button
                        onClick={() => !act.completed && setCompletingActivity(act)}
                        className="shrink-0"
                      >
                        {act.completed ? (
                          <CheckCircle2 className="size-5 text-green-500" />
                        ) : (
                          <Circle className="size-5 text-gray-300 hover:text-emerald-500" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${act.completed ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}>
                          {act.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[act.category] || ""}`}>
                            {CATEGORY_LABELS[act.category] || act.category}
                          </span>
                          {act.scheduledTime && (
                            <span className="text-[10px] text-gray-400">{act.scheduledTime}</span>
                          )}
                          {act.completed && act.actualPleasure != null && (
                            <span className="text-[10px] text-green-600 dark:text-green-400">
                              Pleasure: {act.actualPleasure}/10
                            </span>
                          )}
                        </div>
                      </div>
                      {!act.completed && (
                        <button
                          onClick={() => a.deleteActivity(act._id)}
                          className="shrink-0 rounded p-1 text-gray-300 hover:text-red-500 dark:text-gray-600"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {a.activities.length === 0 && !a.loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="mb-4 size-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">No activities this week.</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Plan activities to boost your mood and build healthy habits.
          </p>
        </div>
      )}

      <ActivityEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={async (data) => {
          await a.createActivity(data)
          setEditorOpen(false)
        }}
        saving={a.saving}
      />

      <CompleteActivityModal
        activity={completingActivity}
        onClose={() => setCompletingActivity(null)}
        onComplete={async (data) => {
          if (completingActivity) {
            await a.completeActivity(completingActivity._id, data)
            setCompletingActivity(null)
          }
        }}
        saving={a.saving}
      />
    </div>
  )
}
