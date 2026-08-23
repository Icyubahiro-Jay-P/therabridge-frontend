import { api } from "@/lib/api"

export interface Activity {
  _id: string
  user: string
  title: string
  category: string
  scheduledDate: string
  scheduledTime: string | null
  duration: number | null
  expectedPleasure: number
  actualPleasure: number | null
  completed: boolean
  completedAt: string | null
  notes: string | null
  moodBefore: string | null
  moodAfter: string | null
  pointsEarned?: number
  createdAt: string
  updatedAt: string
}

export interface ActivityStats {
  totalActivities: number
  completedActivities: number
  completionRate: number
  categoryBreakdown: { category: string; total: number; completed: number }[]
  avgPleasure: number | null
}

export const CATEGORIES = [
  { value: "social", label: "Social", color: "teal" },
  { value: "physical", label: "Physical", color: "emerald" },
  { value: "creative", label: "Creative", color: "amber" },
  { value: "productive", label: "Productive", color: "gray" },
  { value: "relaxation", label: "Relaxation", color: "emerald" },
  { value: "outdoor", label: "Outdoor", color: "teal" },
  { value: "learning", label: "Learning", color: "teal" },
  { value: "self_care", label: "Self-Care", color: "amber" },
  { value: "other", label: "Other", color: "gray" },
] as const

export const activityApi = {
  create: (data: {
    title: string; category: string; scheduledDate: string;
    scheduledTime?: string; duration?: number; expectedPleasure: number;
    moodBefore?: string; notes?: string;
  }) => api.post<Activity>("/api/activities", data).then((r) => r.data),

  list: (params?: { week?: string; completed?: boolean; category?: string }) =>
    api.get<{ activities: Activity[] }>("/api/activities", { params }).then((r) => r.data),

  get: (id: string) => api.get<Activity>(`/api/activities/${id}`).then((r) => r.data),

  complete: (id: string, data?: { actualPleasure?: number; moodAfter?: string; notes?: string }) =>
    api.post<Activity>(`/api/activities/${id}/complete`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/api/activities/${id}`).then((r) => r.data),

  stats: () => api.get<ActivityStats>("/api/activities/stats").then((r) => r.data),
}
