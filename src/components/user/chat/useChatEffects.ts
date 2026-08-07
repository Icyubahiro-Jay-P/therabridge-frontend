import { useEffect } from "react"
import { api } from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { playMessageSound } from "@/lib/sound"
import { getErrorMessage, loadSetting, CHAT_PAGE_SIZE } from "./utils"
import type { ChatUser, Conversation, DirectMessage } from "./types"

// Fire-and-forget server-side mark-read. The backend flips `read`/`readAt`,
// clears the sender's unread notifications, and emits `conversations_updated`
// to the reader's own room so every tab reconciles.
function markConversationRead(peerId: string) {
  void api.put(`/api/chat/conversation/${peerId}/read`).catch(() => {})
}

export function useChatEffects(state: {
  username?: string
  currentUserId?: string
  partner: ChatUser | null
  setShowPreviews: (v: boolean) => void
  setEnterToSend: (v: boolean) => void
  setLoadingList: (v: boolean) => void
  setConversations: (v: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void
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
  const {
    username,
    currentUserId,
    partner,
    setShowPreviews,
    setEnterToSend,
    setLoadingList,
    setConversations,
    setError,
    setPartner,
    setMessages,
    setLoadingMessages,
    setEditingId,
    setEditingContent,
    setNextCursor,
    setHasOlderMessages,
    setLoadingOlder,
  } = state

  useEffect(() => {
    function reload() {
      setShowPreviews(loadSetting("messagePreviews", true))
      setEnterToSend(loadSetting("enterToSend", true))
    }
    window.addEventListener("storage", reload)
    const interval = setInterval(reload, 2000)
    return () => {
      window.removeEventListener("storage", reload)
      clearInterval(interval)
    }
  }, [setShowPreviews, setEnterToSend])

  useEffect(() => {
    async function load() {
      setLoadingList(true)
      try {
        const { data } = await api.get<{ data: Conversation[] }>(
          "/api/chat/conversations"
        )
        setConversations(Array.isArray(data.data) ? data.data : [])
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoadingList(false)
      }
    }
    void load()
  }, [setLoadingList, setConversations, setError])

  useEffect(() => {
    if (!username) {
      setPartner(null)
      setMessages([])
      setNextCursor(null)
      setHasOlderMessages(false)
      setLoadingOlder(false)
      setError(null)
      setEditingId(null)
      setEditingContent("")
      return
    }
    if (username === "therry") {
      setPartner(null)
      setMessages([])
      setNextCursor(null)
      setHasOlderMessages(false)
      setLoadingOlder(false)
      setError(null)
      setEditingId(null)
      setEditingContent("")
      return
    }
    let mounted = true
    async function resolveAndFetch() {
      setLoadingMessages(true)
      setMessages([])
      setNextCursor(null)
      setHasOlderMessages(false)
      setLoadingOlder(false)
      setError(null)
      try {
        const { data } = await api.get(`/api/users/${username}`)
        const user: ChatUser = {
          _id: data._id ?? data.id,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar,
        }
        if (!mounted) return
        setPartner(user)
        const response = await api.get<{ data: DirectMessage[]; nextCursor: string | null }>(
          `/api/chat/conversation/${user._id}?limit=${CHAT_PAGE_SIZE}`
        )
        if (mounted) {
          setMessages(Array.isArray(response.data.data) ? response.data.data : [])
          setNextCursor(response.data.nextCursor ?? null)
          setHasOlderMessages(!!response.data.nextCursor)
          setLoadingMessages(false)
          // Clear the list badge for the opened thread immediately (optimistic),
          // then let the socket event reconcile it across tabs.
          setConversations((prev) =>
            prev.map((c) =>
              c.partner._id === user._id ? { ...c, unread: 0 } : c
            )
          )
          markConversationRead(user._id)
        }
      } catch {
        if (mounted) {
          setPartner(null)
          setError(`User "${username}" not found`)
        }
      } finally {
        if (mounted) setLoadingMessages(false)
      }
    }
    void resolveAndFetch()
    return () => {
      mounted = false
    }
  }, [
    username,
    setPartner,
    setMessages,
    setNextCursor,
    setHasOlderMessages,
    setLoadingOlder,
    setError,
    setEditingId,
    setEditingContent,
    setLoadingMessages,
    setConversations,
  ])

  useEffect(() => {
    if (!partner) return
    const socket = getSocket()
    if (!socket) return
    const partnerId = partner._id

    function isForThisConversation(message: DirectMessage) {
      return (
        message.sender?._id === partnerId ||
        message.recipient?._id === partnerId
      )
    }

    function onDmMessage(message: DirectMessage) {
      if (!isForThisConversation(message)) return
      setMessages((prev) => {
        const map = new Map(prev.map((m) => [m._id, m]))
        const isNew = !map.has(message._id)
        map.set(message._id, message)
        if (isNew && message.sender?._id !== currentUserId)
          playMessageSound()
        return [...map.values()]
      })
      // The thread is open, so a freshly delivered incoming message should be
      // marked read right away (keeps the unread count pinned at 0 while viewing).
      if (message.sender?._id !== currentUserId && !message.read) {
        markConversationRead(partnerId)
      }
    }

    function onDmUpdated(message: DirectMessage) {
      if (!isForThisConversation(message)) return
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      )
    }

    function onDmUnsent({ messageId }: { messageId: string }) {
      setMessages((prev) =>
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
          setConversations(Array.isArray(data.data) ? data.data : [])
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
  }, [partner, currentUserId, setMessages, setConversations])
}
