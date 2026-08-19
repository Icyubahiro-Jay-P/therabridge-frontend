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
