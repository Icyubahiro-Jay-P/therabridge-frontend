import { api } from "@/lib/api"

export type HabitColor = "emerald" | "sky" | "violet" | "amber" | "rose" | "teal"

export interface Habit {
  _id: string
  user: string
  name: string
  emoji: string
  color: HabitColor
  daysOfWeek: number[]
  reminderTime: string | null
  active: boolean
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface HabitWithProgress extends Habit {
  completedDates: string[]
  currentStreak: number
  longestStreak: number
  completionRate30d: number
  totalCompletions: number
}

export interface HabitsSummary {
  date: string
  todayCompleted: number
  todayScheduled: number
  activeCount: number
  bestStreak: number
}

export interface HabitsResponse {
  habits: HabitWithProgress[]
  summary: HabitsSummary
}

export interface ToggleResult {
  habitId: string
  date: string
  completed: boolean
  pointsEarned: number
  petLeveledUp?: boolean
}

export const HABIT_COLORS: HabitColor[] = ["emerald", "sky", "violet", "amber", "rose", "teal"]

export const colorClasses: Record<HabitColor, { bg: string; text: string; ring: string; soft: string }> = {
  emerald: {
    bg: "bg-emerald-600",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-400",
    soft: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  sky: {
    bg: "bg-sky-600",
    text: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-400",
    soft: "bg-sky-50 dark:bg-sky-950/40",
  },
  violet: {
    bg: "bg-violet-600",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-400",
    soft: "bg-violet-50 dark:bg-violet-950/40",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-400",
    soft: "bg-amber-50 dark:bg-amber-950/40",
  },
  rose: {
    bg: "bg-rose-600",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-400",
    soft: "bg-rose-50 dark:bg-rose-950/40",
  },
  teal: {
    bg: "bg-teal-600",
    text: "text-teal-600 dark:text-teal-400",
    ring: "ring-teal-400",
    soft: "bg-teal-50 dark:bg-teal-950/40",
  },
}

export interface HabitPayload {
  name: string
  emoji?: string
  color?: HabitColor
  daysOfWeek?: number[]
  reminderTime?: string | null
  active?: boolean
}

export const habitsApi = {
  list: (params?: { active?: boolean; date?: string }) =>
    api
      .get<HabitsResponse>("/api/habits", { params })
      .then((r) => r.data),

  create: (payload: HabitPayload) =>
    api.post<Habit>("/api/habits", payload).then((r) => r.data),

  update: (id: string, payload: Partial<HabitPayload>) =>
    api.put<Habit>(`/api/habits/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    api.delete<{ message: string }>(`/api/habits/${id}`).then((r) => r.data),

  toggle: (id: string, date: string) =>
    api.post<ToggleResult>(`/api/habits/${id}/toggle`, { date }).then((r) => r.data),
}
