import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"
import { restoreQueries, snapshotQueries } from "./optimistic"
import {
  getTherapistByUsername,
  getTherapistReviews,
  getAvailability,
  getMyAppointments,
  getTherapistAppointments as fetchTherapistAppointments,
  createAppointment as createAppointmentRequest,
  cancelAppointment as cancelAppointmentRequest,
  updateAppointmentStatus as updateAppointmentStatusRequest,
  createTherapistReview as createReviewRequest,
} from "./sessions-api"
import { getBillingStatus, createCheckoutSession, cancelSubscription } from "./billing-api"
import type { Appointment, AppointmentStatus, Review } from "@/types/sessions"
import type { TherapistProfile } from "@/types/user"

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  limit: number
}

type QueryParams = Record<string, string | number | boolean | undefined>

function paginatedQueryKey(base: string[], params: QueryParams) {
  return [...base, params]
}

// User queries
export function useGetTherapists<T = unknown>(page = 1, limit = 20, filters: QueryParams = {}) {
  return useQuery({
    queryKey: paginatedQueryKey(["therapists"], { page, limit, ...filters }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const { data } = await api.get<PaginatedResponse<T>>(
        `/api/users/therapists?${params}`
      )
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// Notifications queries
export function useGetNotifications<T = unknown>(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["notifications", { page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const { data } = await api.get<PaginatedResponse<T>>(
        `/api/notifications?${params}`
      )
      return data
    },
    staleTime: 10 * 1000,
  })
}

/** Structural subset every notification mutation patches optimistically. */
export interface NotificationLike {
  _id: string
  read: boolean
}

function patchAllNotificationPages<T extends NotificationLike>(
  queryClient: ReturnType<typeof useQueryClient>,
  transform: (page: PaginatedResponse<T>) => PaginatedResponse<T>,
) {
  queryClient.setQueriesData<PaginatedResponse<T>>(
    { queryKey: ["notifications"] },
    (old) => (old ? transform(old) : old)
  )
}

/**
 * Marks one notification read. The cache is patched before the request goes
 * out; on failure the previous state is restored and the error rethrown.
 */
export function useMarkNotificationRead<T extends NotificationLike = NotificationLike>() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.put(
        `/api/notifications/${notificationId}/read`
      )
      return data
    },
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      const previous = snapshotQueries(queryClient, ["notifications"])
      patchAllNotificationPages<T>(
        queryClient,
        (page) => ({
          ...page,
          data: page.data.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
        })
      )
      return { previous }
    },
    onError: (_error, _notificationId, context) => {
      restoreQueries(queryClient, context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

/**
 * Marks every notification read. Cache-first like {@link useMarkNotificationRead}.
 */
export function useMarkAllNotificationsRead<T extends NotificationLike = NotificationLike>() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put(`/api/notifications/read-all`)
      return data
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      const previous = snapshotQueries(queryClient, ["notifications"])
      patchAllNotificationPages<T>(
        queryClient,
        (page) => ({
          ...page,
          data: page.data.map((n) => ({ ...n, read: true })),
        })
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      restoreQueries(queryClient, context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

/**
 * Deletes one notification. It disappears from the list instantly and is
 * restored if the delete fails.
 */
export function useDeleteNotification<T extends NotificationLike = NotificationLike>() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.delete(`/api/notifications/${notificationId}`)
      return data
    },
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      const previous = snapshotQueries(queryClient, ["notifications"])
      patchAllNotificationPages<T>(
        queryClient,
        (page) => ({
          ...page,
          data: page.data.filter((n) => n._id !== notificationId),
          total: Math.max(0, page.total - 1),
        })
      )
      return { previous }
    },
    onError: (_error, _notificationId, context) => {
      restoreQueries(queryClient, context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

/**
 * Deletes every notification. The list empties instantly and is restored if
 * the request fails.
 */
export function useDeleteAllNotifications<T extends NotificationLike = NotificationLike>() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/api/notifications`)
      return data
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      const previous = snapshotQueries(queryClient, ["notifications"])
      patchAllNotificationPages<T>(
        queryClient,
        (page) => ({
          ...page,
          data: [],
          total: 0,
          totalPages: 0,
        })
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      restoreQueries(queryClient, context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
