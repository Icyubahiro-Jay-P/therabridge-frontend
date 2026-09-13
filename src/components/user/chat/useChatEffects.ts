import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useChatStore } from "@/store/chat-store"
import { api } from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { playMessageSound } from "@/lib/sound"
import { getErrorMessage, loadSetting, CHAT_PAGE_SIZE } from "./utils"
import type { ChatUser, Conversation, DirectMessage } from "./types"

function markConversationRead(peerId: string) {
  void api.put(`/api/chat/conversation/${peerId}/read`).catch(() => {})
}

export function useChatEffects(username?: string) {
  const currentUserId = useAuthStore((s) => s.user?.id)

  const setConversations = useChatStore((s) => s.setConversations)
  const setLoadingList = useChatStore((s) => s.setLoadingList)
  const setError = useChatStore((s) => s.setError)
  const setPartner = useChatStore((s) => s.setPartner)
  const setMessages = useChatStore((s) => s.setMessages)
  const setLoadingMessages = useChatStore((s) => s.setLoadingMessages)
  const setNextCursor = useChatStore((s) => s.setNextCursor)
  const setHasOlderMessages = useChatStore((s) => s.setHasOlderMessages)
  const setShowPreviews = useChatStore((s) => s.setShowPreviews)
  const setEnterToSend = useChatStore((s) => s.setEnterToSend)
  const resetChat = useChatStore((s) => s.resetChat)

  // ── Settings sync ──
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

  // ── Load conversations ──
  useEffect(() => {
    async function load() {
      setLoadingList(true)
      try {
        const { data } = await api.get<{ data: Conversation[] }>(
          "/api/chat/conversations",
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

  // ── Resolve partner & load messages when username changes ──
  useEffect(() => {
    if (!username || username === "therry") {
      resetChat()
      return
    }
    let mounted = true
    async function resolveAndFetch() {
      // Clears messages/reply/edit/menu/timestamp state left over from
      // whatever conversation was open before, so none of it leaks into
      // this one.
      resetChat()
      setLoadingMessages(true)
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
          `/api/chat/conversation/${user._id}?limit=${CHAT_PAGE_SIZE}`,
        )
        if (mounted) {
          setMessages(Array.isArray(response.data.data) ? response.data.data : [])
          setNextCursor(response.data.nextCursor ?? null)
          setHasOlderMessages(!!response.data.nextCursor)
          setLoadingMessages(false)
          setConversations((prev) =>
            prev.map((c) =>
              c.partner._id === user._id ? { ...c, unread: 0 } : c,
            ),
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
    return () => { mounted = false }
  }, [
    username,
    currentUserId,
    setPartner,
    setMessages,
    setNextCursor,
    setHasOlderMessages,
    setError,
    setLoadingMessages,
    setConversations,
    resetChat,
  ])

  // ── Socket listeners for DM events ──
  // Runs regardless of whether a conversation is currently open, so the
  // sidebar's conversation list and unread badges stay live even while the
  // user is sitting on the empty-state/sidebar view.
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    function onConversationsUpdated() {
      void api
        .get<{ data: Conversation[] }>("/api/chat/conversations")
        .then(({ data }) => {
          const list = Array.isArray(data.data) ? data.data : []
          setConversations(list)
          // If this update still shows unread messages for the conversation
          // the user currently has open, they're already seeing them - the
          // optimistic "0 unread" from opening it may have been overwritten
          // by this refetch, so re-assert it rather than leaving a stale badge.
          const openPartnerId = useChatStore.getState().partner?._id
          if (openPartnerId) {
            const openConvo = list.find((c) => c.partner._id === openPartnerId)
            if (openConvo && openConvo.unread > 0) {
              markConversationRead(openPartnerId)
            }
          }
        })
        .catch(() => {})
    }

    socket.on("conversations_updated", onConversationsUpdated)
    return () => { socket.off("conversations_updated", onConversationsUpdated) }
  }, [setConversations])

  const partner = useChatStore((s) => s.partner)
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
      if (message.sender?._id !== currentUserId && !message.read) {
        markConversationRead(partnerId)
      }
    }

    function onDmUpdated(message: DirectMessage) {
      if (!isForThisConversation(message)) return
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m)),
      )
    }

    function onDmUnsent({ messageId }: { messageId: string }) {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, unsent: true, content: "Message unsent" }
            : m,
        ),
      )
    }

    socket.on("dm_message", onDmMessage)
    socket.on("dm_message_updated", onDmUpdated)
    socket.on("dm_message_unsent", onDmUnsent)
    return () => {
      socket.off("dm_message", onDmMessage)
      socket.off("dm_message_updated", onDmUpdated)
      socket.off("dm_message_unsent", onDmUnsent)
    }
  }, [partner, currentUserId, setMessages])
}
