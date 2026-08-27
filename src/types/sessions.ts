// Data shapes for therapist reviews and appointments/sessions.
// Mirrors the backend response contracts (controllers in backend/controllers).

export interface Reviewer {
  _id: string
  firstName: string
  lastName: string
  username: string
  avatar?: string | null
}

export interface Review {
  _id: string
  reviewer: Reviewer
  therapist: string
  rating: number
  title?: string
  content: string
  createdAt: string
  updatedAt?: string
}

export type AppointmentStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "missed"

export interface AppointmentParticipant {
  _id: string
  firstName: string
  lastName: string
  username: string
  avatar?: string | null
  specialization?: string[]
}

export interface Appointment {
  _id: string
  user: string | AppointmentParticipant
  therapist: string | AppointmentParticipant
  start: string
  duration: number
  type: string
  notes?: string
  status: AppointmentStatus
  cancelled?: boolean
  cancelledBy?: string
  cancelledAt?: string | null
  createdAt?: string
}

export interface AvailabilityResponse {
  duration: number
  slots: { date: string; time: string }[]
}