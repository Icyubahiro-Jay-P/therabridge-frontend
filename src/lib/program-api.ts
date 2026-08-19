import { api } from "@/lib/api"

export interface ProgramActivity {
  _id: string
  title: string
  description: string
  type: "reading" | "reflection" | "exercise" | "checkin"
  duration: string
}

export interface ProgramWeek {
  _id: string
  title: string
  description: string
  activities: ProgramActivity[]
}

export interface Program {
  _id: string
  title: string
  description: string
  category: "anxiety" | "mood" | "stress" | "sleep" | "resilience"
  duration: string
  weeks: ProgramWeek[]
  totalWeeks?: number
  totalActivities?: number
  progress?: ProgramProgressSummary | null
  createdAt?: string
  updatedAt?: string
}

export interface ProgramProgressSummary {
  currentWeek: number
  currentActivity: number
  completedCount: number
  totalActivities: number
  percentage: number
  completed: boolean
  startedAt?: string
  lastActivityAt?: string
}

export interface ProgramProgress {
  currentWeek: number
  currentActivity: number
  completedWeeks: number[]
  completedActivities: { weekIndex: number; activityIndex: number }[]
  lastActivityAt: string
}

export interface ProgramListItem {
  _id: string
  title: string
  description: string
  category: string
  duration: string
  totalWeeks: number
  totalActivities: number
  progress: ProgramProgressSummary | null
}

export interface CompleteActivityResponse {
  progress: ProgramProgress
  weekCompleted: boolean
  pointsEarned: number
  completedCount: number
  totalActivities: number
  percentage: number
}

export const programApi = {
  list: (category?: string) =>
    api
      .get<{ programs: ProgramListItem[] }>("/programs", {
        params: category ? { category } : undefined,
      })
      .then((r) => r.data.programs),

  get: (id: string) =>
    api.get<{ program: Program; progress: ProgramProgress | null }>(`/programs/${id}`).then((r) => r.data),

  start: (id: string) =>
    api.post<{ progress: ProgramProgress }>(`/programs/${id}/start`).then((r) => r.data.progress),

  completeActivity: (id: string, weekIndex: number, activityIndex: number) =>
    api
      .post<CompleteActivityResponse>(`/programs/${id}/complete`, {
        weekIndex,
        activityIndex,
      })
      .then((r) => r.data),

  myPrograms: () =>
    api
      .get<{ inProgress: ProgramListItem[]; completed: ProgramListItem[] }>("/programs/mine")
      .then((r) => r.data),
}
