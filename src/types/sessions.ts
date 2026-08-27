// Data shapes for therapist reviews, appointments/sessions, and billing.
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
  paid: boolean
  cancelled?: boolean
  cancelledBy?: string
  cancelledAt?: string | null
  createdAt?: string
}

export interface AvailabilityResponse {
  duration: number
  slots: { date: string; time: string }[]
}

export interface BillingPayment {
  _id: string
  user: string
  provider: string
  intent: "subscribe" | "session"
  amount?: number
  currency?: string
  status: string
  appointment?: { _id: string; start?: string; status?: string } | null
  createdAt: string
}

export interface BillingStatus {
  subscription: {
    plan: string
    status: string
    cycleEndsAt?: string | null
    stripeCustomerId?: string
  } | null
  payments: BillingPayment[]
}