import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCommunityStore } from "@/store/community-store"

/**
 * Thin hook that syncs route params into the Zustand community store.
 * All real state lives in useCommunityStore.
 */
export function useCommunityState() {
  const { inviteKey } = useParams<{ inviteKey: string }>()

  useEffect(() => {
    useCommunityStore.setState({ inviteKey: inviteKey ?? null })
  }, [inviteKey])

  return { inviteKey }
}
