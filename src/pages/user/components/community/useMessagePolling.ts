import { useEffect } from "react"
import { api } from "@/lib/api"
import { getErrorMessage } from "./utils"
import type { Community, CommunityMessage } from "./types"

export function useMessagePolling(state: {
  active: Community | null
  setMessages: React.Dispatch<React.SetStateAction<CommunityMessage[]>>
  setLoadingMessages: (v: boolean) => void
  setError: (v: string | null) => void
}) {
  useEffect(() => {
    if (!state.active) {
      state.setMessages([])
      return
    }

    let mounted = true
    let since: string | null = null

    async function pollCommunity() {
      if (!mounted) return

      try {
        const c = state.active!
        const url = `/api/chat/communities/${c._id}/updates${since ? `?since=${encodeURIComponent(since)}` : ""}`
        const response = await api.get<Community>(url, { timeout: 35000 })

        if (!mounted) return
        if (response.status === 200) {
          state.setMessages(response.data.messages)
          since = response.headers["x-last-updated"] || new Date().toISOString()
          await api.post(`/api/chat/communities/${c._id}/read`)
        }
      } catch (err) {
        if (!mounted) return
        state.setError(getErrorMessage(err))
      }

      if (mounted) {
        void pollCommunity()
      }
    }

    state.setLoadingMessages(true)
    state.setMessages([])

    void pollCommunity().finally(() => {
      if (mounted) state.setLoadingMessages(false)
    })

    return () => {
      mounted = false
    }
  }, [state.active])
}
