import { useEffect } from "react"
import { api } from "@/lib/api"
import { getErrorMessage, loadSetting } from "./utils"
import type { ChatUser, Conversation, DirectMessage } from "./types"

export function useChatEffects(state: {
  username?: string
  partner: ChatUser | null
  setShowPreviews: (v: boolean) => void
  setEnterToSend: (v: boolean) => void
  setLoadingList: (v: boolean) => void
  setConversations: (v: Conversation[]) => void
  setError: (v: string | null) => void
  setPartner: (v: ChatUser | null) => void
  setMessages: (v: DirectMessage[]) => void
  setLoadingMessages: (v: boolean) => void
}) {
  useEffect(() => {
    function reload() {
      state.setShowPreviews(loadSetting("messagePreviews", true))
      state.setEnterToSend(loadSetting("enterToSend", true))
    }
    window.addEventListener("storage", reload)
    const interval = setInterval(reload, 2000)
    return () => { window.removeEventListener("storage", reload); clearInterval(interval) }
  }, [])

  useEffect(() => {
    async function load() {
      state.setLoadingList(true)
      try {
        const { data } = await api.get<Conversation[]>("/api/chat/conversations")
        state.setConversations(data)
      } catch (err) { state.setError(getErrorMessage(err)) }
      finally { state.setLoadingList(false) }
    }
    void load()
  }, [])

  useEffect(() => {
    if (!state.username) { state.setPartner(null); state.setMessages([]); state.setError(null); return }
    let mounted = true
    async function resolveAndFetch() {
      state.setLoadingMessages(true); state.setMessages([]); state.setError(null)
      try {
        const { data } = await api.get(`/api/users/${state.username}`)
        const user: ChatUser = { _id: data._id ?? data.id, username: data.username, firstName: data.firstName, lastName: data.lastName, avatar: data.avatar }
        if (!mounted) return
        state.setPartner(user)
        const { data: msgData } = await api.get<DirectMessage[]>(`/api/chat/conversation/${user._id}`)
        if (mounted) state.setMessages(msgData)
      } catch { if (mounted) { state.setPartner(null); state.setError(`User "${state.username}" not found`) } }
      finally { if (mounted) state.setLoadingMessages(false) }
    }
    void resolveAndFetch()
    return () => { mounted = false }
  }, [state.username])

  useEffect(() => {
    if (!state.partner) return
    let mounted = true
    async function poll() {
      try {
        const { data } = await api.get<DirectMessage[]>(`/api/chat/conversation/${state.partner!._id}`)
        if (mounted) state.setMessages(data)
      } catch {}
    }
    const interval = setInterval(poll, 5000)
    return () => { mounted = false; clearInterval(interval) }
  }, [state.partner])
}
