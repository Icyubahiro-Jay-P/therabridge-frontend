import { api } from "@/lib/api"

export interface GratitudePrompt {
  id: string
  text: string
}

export interface GratitudeEntry {
  _id: string
  user: string
  promptId: string
  promptText: string
  content: string
  pointsEarned?: number
  createdAt: string
  updatedAt: string
}

export interface GratitudeStreak {
  streak: number
  totalEntries: number
}

export const gratitudeApi = {
  getDailyPrompt: () =>
    api.get<{ prompt: GratitudePrompt; hasEntryToday: boolean }>("/gratitude/prompt").then((r) => r.data),

  create: (data: { promptId: string; promptText: string; content: string }) =>
    api.post<GratitudeEntry>("/gratitude", data).then((r) => r.data),

  list: (params?: { page?: number }) =>
    api.get<{ entries: GratitudeEntry[]; hasMore: boolean }>("/gratitude", { params }).then((r) => r.data),

  streak: () =>
    api.get<GratitudeStreak>("/gratitude/streak").then((r) => r.data),

  delete: (id: string) => api.delete(`/gratitude/${id}`).then((r) => r.data),
}
