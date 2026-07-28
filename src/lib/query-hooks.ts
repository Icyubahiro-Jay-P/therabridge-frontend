import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"

/**
 * Custom hooks for API calls with automatic caching via React Query
 */

// User queries
export function useGetUsers(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: ["users", { page, limit, ...filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const { data } = await api.get(`/users?${params}`)
      return data
    },
  })
}

export function useGetTherapists(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: ["therapists", { page, limit, ...filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const { data } = await api.get(`/users/therapists?${params}`)
      return data
    },
  })
}

export function useGetUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`)
      return data
    },
    enabled: !!userId,
  })
}

// Mood queries
export function useGetMyMoods(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: ["moods", { page, limit, ...filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      })
      const { data } = await api.get(`/mood?${params}`)
      return data
    },
  })
}

export function useGetMoodStats() {
  return useQuery({
    queryKey: ["mood-stats"],
    queryFn: async () => {
      const { data } = await api.get(`/mood/stats`)
      return data
    },
  })
}

export function useLogMood() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (moodData: any) => {
      const { data } = await api.post(`/mood`, moodData, {
        headers: {
          "Idempotency-Key": `mood-${Date.now()}-${Math.random()}`,
        },
      })
      return data
    },
    onSuccess: () => {
      // Invalidate mood-related caches
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
      const { data } = await api.get(`/chat/conversations?${params}`)
      return data
    },
  })
}

export function useGetConversation(userId: string) {
  return useQuery({
    queryKey: ["conversation", userId],
    queryFn: async () => {
      const { data } = await api.get(`/chat/conversation/${userId}`)
      return data
    },
    enabled: !!userId,
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
      const { data } = await api.post(
        `/chat/send`,
        { recipientId, content },
        {
          headers: {
            "Idempotency-Key": `msg-${recipientId}-${Date.now()}-${Math.random()}`,
          },
        }
      )
      return data
    },
    onSuccess: (_, variables) => {
      // Invalidate conversation cache
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
      const { data } = await api.get(`/exercises`)
      return data
    },
    staleTime: 30 * 60 * 1000, // Exercises change infrequently, cache longer
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
      const { data } = await api.get(`/exercises/logs/mine?${params}`)
      return data
    },
  })
}

export function useStartExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const { data } = await api.post(
        `/exercises/${exerciseId}/start`,
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
        `/exercises/${exerciseId}/complete`,
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
      const { data } = await api.get(`/notifications?${params}`)
      return data
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.patch(`/notifications/${notificationId}/read`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
