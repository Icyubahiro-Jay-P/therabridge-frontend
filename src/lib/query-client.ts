import { QueryClient } from "@tanstack/react-query"
import type { DefaultOptions } from "@tanstack/react-query"

/**
 * React Query configuration with caching defaults
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Cache data for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep unused data in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests once
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 1,
  },
}

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})
