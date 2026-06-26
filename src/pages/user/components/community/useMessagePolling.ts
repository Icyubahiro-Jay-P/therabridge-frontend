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
    async function loadMessages() {
      state.setLoadingMessages(true)
      state.setMessages([])
      try {
        const c = state.active!
        const { data } = await api.get<Community>(`/api/chat/communities/${c._id}`)
        if (mounted) {
          state.setMessages(data.messages)
          await api.post(`/api/chat/communities/${c._id}/read`)
        }
      } catch (err) {
        if (mounted) state.setError(getErrorMessage(err))
      } finally {
        if (mounted) state.setLoadingMessages(false)
      }
    }
    void loadMessages()
    const interval = setInterval(async () => {
      if (!mounted) return
      try {
        const c = state.active!
        const { data } = await api.get<Community>(`/api/chat/communities/${c._id}`)
        if (mounted) state.setMessages(data.messages)
      } catch {}
    }, 5000)
    return () => { mounted = false; clearInterval(interval) }
  }, [state.active])
}
