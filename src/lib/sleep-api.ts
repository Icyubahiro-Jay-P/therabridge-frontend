import { api } from "@/lib/api"

export interface SleepLog {
  _id: string
  user: string
  date: string
  quality: number
  bedtime: string
  wakeTime: string
  hoursSlept: number
  notes: string
  dreams: string
  pointsEarned?: number
  createdAt: string
  updatedAt: string
}

export interface SleepContent {
  _id: string
  title: string
  type: "sound" | "meditation" | "story"
  duration: number
  category: string
  audioUrl: string
  description: string
}

export interface SleepStats {
  avgQuality: number
  avgHours: number
  totalLogs: number
  streak: number
  weeklyTrend: {
    date: string
    quality: number
    hours: number
    count: number
  }[]
}

export interface PaginatedLogs {
  data: SleepLog[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export const sleepApi = {
  log: (data: {
    date?: string
    quality: number
    bedtime?: string
    wakeTime?: string
    hoursSlept?: number
    notes?: string
    dreams?: string
  }) => api.post<SleepLog>("/api/sleep", data).then((r) => r.data),

  list: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedLogs>("/api/sleep", { params }).then((r) => r.data),

  stats: () => api.get<SleepStats>("/api/sleep/stats").then((r) => r.data),

  content: (params?: { type?: string; category?: string }) =>
    api.get<{ content: SleepContent[] }>("/api/sleep/content", { params }).then((r) => r.data),

  deleteLog: (id: string) => api.delete(`/api/sleep/${id}`).then((r) => r.data),
}
