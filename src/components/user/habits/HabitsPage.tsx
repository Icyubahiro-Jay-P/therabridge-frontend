import { useEffect, useRef } from "react"
import {
  Plus, Flame, ChevronLeft, ChevronRight, Archive,
  Pencil, Trash2, ArchiveRestore, Repeat, Check,
} from "lucide-react"
import { useHabitsState, todayKey } from "./useHabitsState"
import { HabitDialog } from "./HabitDialog"
import { EmptyState } from "@/components/user/shared/EmptyState"
import { colorClasses, type HabitWithProgress } from "@/lib/habits-api"

const DAY_MS = 24 * 60 * 60 * 1000

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatDayLabel(key: string) {
  const d = new Date(`${key}T00:00:00`)
  const today = todayKey()
  if (key === today) return "Today"
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (key === dateKey(yesterday)) return "Yesterday"
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
}

function HabitCard({
  habit,
  viewDate,
  onToggle,
  onEdit,
  onArchive,
  onDelete,
}: {
  habit: HabitWithProgress
  viewDate: string
  onToggle: (id: string, date: string) => void
  onEdit: (habit: HabitWithProgress) => void
  onArchive: (habit: HabitWithProgress, active: boolean) => void
  onDelete: (id: string) => void
}) {
  const c = colorClasses[habit.color] ?? colorClasses.emerald
  const viewDay = new Date(`${viewDate}T00:00:00`).getDay()
  const scheduledToday = habit.daysOfWeek.includes(viewDay)
  const completed = habit.completedDates.includes(viewDate)
  const isFuture = viewDate > todayKey()

  // Last 7 days ending at the viewed date.
  const weekDots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${viewDate}T00:00:00`)
    d.setTime(d.getTime() - (6 - i) * DAY_MS)
    const key = dateKey(d)
    return {
      key,
      done: habit.completedDates.includes(key),
      scheduled: habit.daysOfWeek.includes(d.getDay()),
    }
  })

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900">
      <button
        onClick={() => scheduledToday && !isFuture && onToggle(habit._id, viewDate)}
        disabled={!scheduledToday || isFuture}
        aria-pressed={completed}
        aria-label={completed ? `Undo ${habit.name}` : `Complete ${habit.name}`}
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-2 text-lg transition-all ${
          completed
            ? `${c.bg} border-transparent text-white`
            : scheduledToday && !isFuture
              ? "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
              : "cursor-not-allowed border-dashed border-gray-200 opacity-40 dark:border-gray-700"
        }`}
      >
        {completed ? <Check className="size-5" /> : <span>{habit.emoji}</span>}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-gray-900 dark:text-white">{habit.name}</h3>
          {habit.currentStreak > 0 && (
            <span className={`flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${c.soft} ${c.text}`}>
              <Flame className="size-3" />
              {habit.currentStreak}
            </span>
          )}
          {!scheduledToday && (
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400 dark:bg-gray-800">
              rest day
            </span>
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
          <div className="flex gap-1">
            {weekDots.map((dot) => (
              <span
                key={dot.key}
                title={dot.key}
                className={`size-2 rounded-full ${
                  dot.done
                    ? c.bg
                    : dot.scheduled
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "bg-gray-100 dark:bg-gray-800"
                } ${dot.key === viewDate ? "ring-1 ring-gray-400" : ""}`}
              />
            ))}
          </div>
          <span>{habit.completionRate30d}% · 30d</span>
          {habit.reminderTime && <span>⏰ {habit.reminderTime}</span>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(habit)}
          aria-label="Edit habit"
          className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Pencil className="size-4 text-gray-400" />
        </button>
        <button
          onClick={() => onArchive(habit, false)}
          aria-label="Archive habit"
          className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Archive className="size-4 text-gray-400" />
        </button>
        <button
          onClick={() => onDelete(habit._id)}
          aria-label="Delete habit"
          className="rounded p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          <Trash2 className="size-4 text-red-400" />
        </button>
      </div>
    </div>
  )
}

export function HabitsPage() {
  const h = useHabitsState()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      void h.fetchHabits(todayKey())
    }
  }) // Intentionally no deps, runs once on mount

  const activeHabits = h.habits.filter((x) => x.active)
  const archivedHabits = h.habits.filter((x) => !x.active)
  const isFuture = h.viewDate > todayKey()
  const progress = h.summary && h.summary.todayScheduled > 0
    ? Math.round((h.summary.todayCompleted / h.summary.todayScheduled) * 100)
    : null

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Small daily wins add up.</p>
        </div>
        <button
          onClick={h.openCreateDialog}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="size-4" />
          New Habit
        </button>
      </div>

      {h.success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {h.success}
        </div>
      )}

      {h.error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
          {h.error}
        </div>
      )}

      {h.loadError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
          {h.loadError}
        </div>
      )}

      {/* Summary */}
      {h.summary && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {progress === null ? "—" : `${progress}%`}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              {h.summary.date === todayKey() ? "today" : "that day"}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="flex items-center gap-1 text-lg font-bold text-amber-700 dark:text-amber-400">
              <Flame className="size-4" />
              {h.summary.bestStreak}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">best streak</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{h.summary.activeCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">active habits</p>
          </div>
        </div>
      )}

      {/* Date navigation */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-2 py-2 dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => h.shiftDate(-1)}
          aria-label="Previous day"
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="size-4 text-gray-500" />
        </button>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatDayLabel(h.viewDate)}</p>
        <button
          onClick={() => h.shiftDate(1)}
          disabled={isFuture}
          aria-label="Next day"
          className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-gray-800"
        >
          <ChevronRight className="size-4 text-gray-500" />
        </button>
      </div>

      {/* Habit list */}
      {h.loading && h.habits.length === 0 ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[76px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : activeHabits.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No habits yet"
          description="Build a routine around small daily actions - water, movement, sleep, anything that supports you."
          action={
            <button
              onClick={h.openCreateDialog}
              className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Plus className="size-4" />
              Create your first habit
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {activeHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              viewDate={h.viewDate}
              onToggle={(id, date) => void h.toggleHabit(id, date)}
              onEdit={h.openEditDialog}
              onArchive={(habit2, active) => void h.setArchived(habit2, active)}
              onDelete={(id) => void h.removeHabit(id)}
            />
          ))}
        </div>
      )}

      {/* Archived */}
      {archivedHabits.length > 0 && (
        <div>
          <button
            onClick={() => h.setShowArchived(!h.showArchived)}
            className="flex w-full items-center justify-between rounded-xl px-1 py-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span>Archived ({archivedHabits.length})</span>
            <ChevronRight className={`size-4 transition-transform ${h.showArchived ? "rotate-90" : ""}`} />
          </button>
          {h.showArchived && (
            <div className="mt-2 space-y-3">
              {archivedHabits.map((habit) => (
                <div
                  key={habit._id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 opacity-60 dark:border-gray-700/60 dark:bg-gray-900"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-lg dark:border-gray-700">
                    {habit.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-gray-700 line-through dark:text-gray-300">{habit.name}</h3>
                    <p className="text-xs text-gray-400">{habit.totalCompletions} total check-ins</p>
                  </div>
                  <button
                    onClick={() => void h.setArchived(habit, true)}
                    aria-label="Restore habit"
                    className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ArchiveRestore className="size-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => void h.removeHabit(habit._id)}
                    aria-label="Delete habit permanently"
                    className="rounded p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="size-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <HabitDialog
        open={h.dialogOpen}
        editing={h.editingHabit}
        saving={h.saving}
        error={h.error}
        onSave={(payload) => void h.saveHabit(payload)}
        onClose={h.closeDialog}
      />
    </div>
  )
}
