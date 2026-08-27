import { api } from "@/lib/api"
import type { PaginatedResponse } from "@/lib/query-hooks"
import type { TherapistProfile } from "@/types/user"
import type {
  Appointment,
  AppointmentStatus,
  AvailabilityResponse,
  Review,
} from "@/types/sessions"

export async function getTherapistByUsername(
  username: string
): Promise<TherapistProfile> {
  const { data } = await api.get<TherapistProfile>(
    `/api/users/therapists/username/${encodeURIComponent(username)}`
  )
  return data
}

export async function getTherapistById(
  id: string
): Promise<TherapistProfile> {
  const { data } = await api.get<TherapistProfile>(
    `/api/users/therapists/${id}`
  )
  return data
}

export async function getTherapistReviews(
  therapistId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Review>> {
  const { data } = await api.get<PaginatedResponse<Review>>(
    `/api/users/therapists/${therapistId}/reviews?page=${page}&limit=${limit}`
  )
  return data
}

export async function createTherapistReview(payload: {
  therapistId: string
  rating: number
  title?: string
  content: string
}): Promise<Review> {
  const { data } = await api.post<Review>(
    `/api/users/therapists/${payload.therapistId}/reviews`,
    {
      rating: payload.rating,
      title: payload.title,
      content: payload.content,
    }
  )
  return data
}

export async function getAvailability(
  therapistId: string,
  days = 14,
  duration = 50
): Promise<AvailabilityResponse> {
  const { data } = await api.get<AvailabilityResponse>(
    `/api/appointments/availability?therapistId=${therapistId}&days=${days}&duration=${duration}`
  )
  return data
}

export async function createAppointment(payload: {
  therapistId: string
  date: string
  time: string
  duration: number
  notes?: string
}): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/api/appointments", payload)
  return data
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<{ data: Appointment[] }>(
    "/api/appointments/mine"
  )
  return data.data
}

export async function getTherapistAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<{ data: Appointment[] }>(
    "/api/appointments/therapist"
  )
  return data.data
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await api.delete<Appointment>(`/api/appointments/${id}`)
  return data
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment> {
  const { data } = await api.put<Appointment>(
    `/api/appointments/therapist/${id}/status`,
    { status }
  )
  return data
}