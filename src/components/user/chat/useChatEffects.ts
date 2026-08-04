import { useEffect } from "react"
import { api } from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { playMessageSound } from "@/lib/sound"
import { getErrorMessage, loadSetting, CHAT_PAGE_SIZE } from "./utils"
import type { ChatUser, Conversation, DirectMessage } from "./types"

export function useChatEffects(state: {
  username?: string
  currentUserId?: string
  partner: ChatUser | null
  setShowPreviews: (v: boolean) => void
  setEnterToSend: (v: boolean) => void
  setLoadingList: (v: boolean) => void
  setConversations: (v: Conversation[]) => void
  setError: (v: string | null) => void
  setPartner: (v: ChatUser | null) => void
  setMessages: (v: DirectMessage[] | ((prev: DirectMessage[]) => DirectMessage[])) => void
  setLoadingMessages: (v: boolean) => void
  setEditingId: (v: string | null) => void
  setEditingContent: (v: string) => void
  setNextCursor: (v: string | null) => void
  setHasOlderMessages: (v: boolean) => void
  setLoadingOlder: (v: boolean) => void
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
      state.setNextCursor(null)
      state.setHasOlderMessages(false)
      state.setLoadingOlder(false)
      state.setError(null)
      state.setEditingId(null)
      state.setEditingContent("")
      return
    }
    if (state.username === "therry") {
      state.setPartner(null)
      state.setMessages([])
      state.setNextCursor(null)
      state.setHasOlderMessages(false)
      state.setLoadingOlder(false)
      state.setError(null)
      state.setEditingId(null)
      state.setEditingContent("")
      return
    }
    let mounted = true
    async function resolveAndFetch() {
      state.setLoadingMessages(true)
      state.setMessages([])
      state.setNextCursor(null)
      state.setHasOlderMessages(false)
      state.setLoadingOlder(false)
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
        const response = await api.get<{ data: DirectMessage[]; nextCursor: string | null }>(
          `/api/chat/conversation/${user._id}?limit=${CHAT_PAGE_SIZE}`
        )
        if (mounted) {
          state.setMessages(Array.isArray(response.data.data) ? response.data.data : [])
          state.setNextCursor(response.data.nextCursor ?? null)
          state.setHasOlderMessages(!!response.data.nextCursor)
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
    const socket = getSocket()
    if (!socket) return
    const partnerId = state.partner._id
    const currentUserId = state.currentUserId

    function isForThisConversation(message: DirectMessage) {
      return (
        message.sender?._id === partnerId ||
        message.recipient?._id === partnerId
      )
    }

    function onDmMessage(message: DirectMessage) {
      if (!isForThisConversation(message)) return
      state.setMessages((prev) => {
        const map = new Map(prev.map((m) => [m._id, m]))
        const isNew = !map.has(message._id)
        map.set(message._id, message)
        if (isNew && message.sender?._id !== currentUserId)
          playMessageSound()
        return [...map.values()]
      })
    }

    function onDmUpdated(message: DirectMessage) {
      if (!isForThisConversation(message)) return
      state.setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      )
    }

    function onDmUnsent({ messageId }: { messageId: string }) {
      state.setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, unsent: true, content: "Message unsent" }
            : m
        )
      )
    }

    function onConversationsUpdated() {
      void api
        .get<{ data: Conversation[] }>("/api/chat/conversations")
        .then(({ data }) => {
          state.setConversations(Array.isArray(data.data) ? data.data : [])
        })
        .catch(() => {})
    }

    socket.on("dm_message", onDmMessage)
    socket.on("dm_message_updated", onDmUpdated)
    socket.on("dm_message_unsent", onDmUnsent)
    socket.on("conversations_updated", onConversationsUpdated)
    return () => {
      socket.off("dm_message", onDmMessage)
      socket.off("dm_message_updated", onDmUpdated)
      socket.off("dm_message_unsent", onDmUnsent)
      socket.off("conversations_updated", onConversationsUpdated)
    }
  }, [state.partner, state.currentUserId, state.setMessages, state.setConversations])
}
