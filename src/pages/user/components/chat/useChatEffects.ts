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
  setMessages: (v: DirectMessage[] | ((prev: DirectMessage[]) => DirectMessage[])) => void
  setLoadingMessages: (v: boolean) => void
}) {
  useEffect(() => {
    function reload() {
      state.setShowPreviews(loadSetting("messagePreviews", true))
      state.setEnterToSend(loadSetting("enterToSend", true))
    }
    window.addEventListener("storage", reload)
    const interval = setInterval(reload, 2000)
    return () => {
      window.removeEventListener("storage", reload)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    async function load() {
      state.setLoadingList(true)
      try {
        const { data } = await api.get<{ data: Conversation[] }>(
          "/api/chat/conversations"
        )
        state.setConversations(Array.isArray(data.data) ? data.data : [])
      } catch (err) {
        state.setError(getErrorMessage(err))
      } finally {
        state.setLoadingList(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    if (!state.username) {
      state.setPartner(null)
      state.setMessages([])
      state.setError(null)
      return
    }
    let mounted = true
    async function resolveAndFetch() {
      state.setLoadingMessages(true)
      state.setMessages([])
      state.setError(null)
      try {
        const { data } = await api.get(`/api/users/${state.username}`)
        const user: ChatUser = {
          _id: data._id ?? data.id,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar,
        }
        if (!mounted) return
        state.setPartner(user)
        const response = await api.get<{ data: DirectMessage[] }>(
          `/api/chat/conversation/${user._id}`
        )
        if (mounted) {
          state.setMessages(Array.isArray(response.data.data) ? response.data.data : [])
          state.setLoadingMessages(false)
        }
      } catch {
        if (mounted) {
          state.setPartner(null)
          state.setError(`User "${state.username}" not found`)
        }
      } finally {
        if (mounted) state.setLoadingMessages(false)
      }
    }
    void resolveAndFetch()
    return () => {
      mounted = false
    }
  }, [state.username])

  useEffect(() => {
    if (!state.partner) return
    let mounted = true
    let since: string | null = null
    let delay = 1000
    const MAX_DELAY = 30000

    async function poll() {
      if (!mounted) return
      try {
        const url = `/api/chat/conversation/${state.partner!._id}/updates${since ? `?since=${encodeURIComponent(since)}` : ""}`
        const response = await api.get<DirectMessage[]>(url, { timeout: 35000 })

        if (!mounted) return
        if (response.status === 200) {
          delay = 1000
          const newMessages = Array.isArray(response.data) ? response.data : []
          state.setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m._id))
            const merged = [...prev]
            for (const msg of newMessages) {
              if (!existingIds.has(msg._id)) {
                merged.push(msg)
                existingIds.add(msg._id)
              }
            }
            return merged
          })
          since = response.headers?.["x-last-updated"] || new Date().toISOString()
        }
      } catch {
        if (!mounted) return
        delay = Math.min(delay * 2, MAX_DELAY)
      }
      if (mounted) {
        setTimeout(() => void poll(), delay)
      }
    }

    void poll()
    return () => {
      mounted = false
    }
  }, [state.partner])
}
