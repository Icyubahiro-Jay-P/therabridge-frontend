import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  limit: number
}

function paginatedQueryKey(base: string[], params: Record<string, any>) {
  return [...base, params]
}

// User queries
export function useGetUsers(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: paginatedQueryKey(["users"], { page, limit, ...filters }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const { data } = await api.get<PaginatedResponse<any>>(
        `/api/users/users?${params}`
      )
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useGetTherapists(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: paginatedQueryKey(["therapists"], { page, limit, ...filters }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const { data } = await api.get<PaginatedResponse<any>>(
        `/api/users/therapists?${params}`
      )
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useGetUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/users/${userId}`)
      return data
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Mood queries
export function useGetMyMoods(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: paginatedQueryKey(["moods"], { page, limit, ...filters }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const { data } = await api.get<PaginatedResponse<any>>(
        `/api/mood?${params}`
      )
      return data
    },
    staleTime: 1 * 60 * 1000,
  })
}

export function useGetMoodStats() {
  return useQuery({
    queryKey: ["mood-stats"],
    queryFn: async () => {
      const { data } = await api.get(`/api/mood/stats`)
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useLogMood() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (moodData: any) => {
      const { data } = await api.post(`/api/mood`, moodData, {
        headers: { "Idempotency-Key": `mood-${Date.now()}-${Math.random()}` },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] })
      queryClient.invalidateQueries({ queryKey: ["mood-stats"] })
    },
  })
}

// Chat queries
export function useGetConversations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["conversations", { page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const { data } = await api.get<PaginatedResponse<any>>(
        `/api/chat/conversations?${params}`
      )
      return data
    },
    staleTime: 30 * 1000,
  })
}

export function useGetConversation(userId: string) {
  return useQuery({
    queryKey: ["conversation", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/chat/conversation/${userId}`)
      return data
    },
    enabled: !!userId,
    staleTime: 10 * 1000,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      recipientId,
      content,
    }: {
      recipientId: string
      content: string
    }) => {
      const idemKey = `msg-${recipientId}-${Date.now()}`
      const { data } = await api.post(
        `/api/chat/send`,
        { recipientId, content },
        {
          headers: { "Idempotency-Key": idemKey },
        }
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.recipientId],
      })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

// Exercise queries
export function useGetExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data } = await api.get(`/api/exercises`)
      return data
    },
    staleTime: 30 * 60 * 1000,
  })
}

export function useGetExerciseLogs(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["exercise-logs", { page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const { data } = await api.get<PaginatedResponse<any>>(
        `/api/exercises/logs/mine?${params}`
      )
      return data
    },
    staleTime: 30 * 1000,
  })
}

export function useStartExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const { data } = await api.post(
        `/api/exercises/${exerciseId}/start`,
        {},
        {
          headers: {
            "Idempotency-Key": `exercise-start-${exerciseId}-${Date.now()}`,
          },
        }
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercise-logs"] })
    },
  })
}

export function useCompleteExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const { data } = await api.post(
        `/api/exercises/${exerciseId}/complete`,
        {},
        {
          headers: {
            "Idempotency-Key": `exercise-complete-${exerciseId}-${Date.now()}`,
          },
        }
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercise-logs"] })
      queryClient.invalidateQueries({ queryKey: ["mood-stats"] })
    },
  })
}

// Notifications queries
export function useGetNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["notifications", { page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const { data } = await api.get<PaginatedResponse<any>>(
        `/api/notifications?${params}`
      )
      return data
    },
    staleTime: 10 * 1000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.put(
        `/api/notifications/${notificationId}/read`
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
