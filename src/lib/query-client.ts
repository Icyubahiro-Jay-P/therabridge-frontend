import { QueryClient } from "@tanstack/react-query"
import type { DefaultOptions } from "@tanstack/react-query"

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  // Mutations never auto-retry: optimistic actions already roll back in
  // onError, and re-firing non-idempotent writes would double-apply them.
  mutations: {
    retry: 0,
  },
}

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})
