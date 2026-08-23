import { api } from "@/lib/api"

export interface Medication {
  _id: string
  user: string
  name: string
  dosage: string
  frequency: "daily" | "twice_daily" | "three_times" | "weekly" | "as_needed"
  timeOfDay: string | null
  startDate: string
  endDate: string | null
  active: boolean
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface MedicationLog {
  _id: string
  user: string
  medication: string | { _id: string; name: string; dosage: string; frequency: string }
  takenAt: string
  skipped: boolean
  sideEffects: string[]
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface AdherenceStats {
  adherenceRate: number
  totalDoses: number
  takenDoses: number
  sideEffects: { name: string; count: number }[]
  streak: number
  takenDaysMap: Record<string, boolean>
}

export const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Once daily",
  twice_daily: "Twice daily",
  three_times: "Three times daily",
  weekly: "Weekly",
  as_needed: "As needed",
}

export const medicationApi = {
  create: (data: {
    name: string
    dosage: string
    frequency: string
    timeOfDay?: string | null
    startDate?: string
    endDate?: string | null
    notes?: string | null
  }) => api.post<Medication>("/api/medications", data).then((r) => r.data),

  list: (params?: { active?: boolean }) =>
    api.get<{ medications: Medication[] }>("/api/medications", { params }).then((r) => r.data),

  update: (id: string, data: Partial<{
    name: string
    dosage: string
    frequency: string
    timeOfDay: string | null
    startDate: string
    endDate: string | null
    active: boolean
    notes: string | null
  }>) => api.put<Medication>(`/api/medications/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/api/medications/${id}`).then((r) => r.data),

  logDose: (data: {
    medicationId: string
    takenAt?: string
    skipped?: boolean
    sideEffects?: string[]
    notes?: string | null
  }) => api.post<MedicationLog>("/api/medications/log", data).then((r) => r.data),

  getLogs: (params?: { page?: number; limit?: number; medicationId?: string }) =>
    api.get<{ logs: MedicationLog[]; hasMore: boolean }>("/api/medications/logs", { params }).then((r) => r.data),

  getStats: (params?: { medicationId?: string; days?: number }) =>
    api.get<AdherenceStats>("/api/medications/stats", { params }).then((r) => r.data),
}
