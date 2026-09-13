import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useCommunityStore } from "@/store/community-store"
import { api } from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { playMessageSound } from "@/lib/sound"
import { getErrorMessage } from "./utils"
import type { Community, CommunityMessage } from "./types"

export function useMessagePolling() {
  // Keyed on the id (a primitive), not the `active` object itself - any
  // settings/membership update replaces `active` with a new object
  // reference for the same community, and depending on the object would
  // tear down and rebuild this whole effect (wiping messages, rejoining the
  // socket room) for no reason.
  const activeId = useCommunityStore((s) => s.active?._id)
  const currentUserId = useAuthStore((s) => s.user?.id)
  const setMessages = useCommunityStore((s) => s.setMessages)
  const setLoadingMessages = useCommunityStore((s) => s.setLoadingMessages)
  const setError = useCommunityStore((s) => s.setError)

  useEffect(() => {
    if (!activeId) {
      setMessages([])
      return
    }

    const communityId = activeId
    let mounted = true

    setLoadingMessages(true)
    setMessages([])

    async function load() {
      try {
        const { data } = await api.get<Community>(
          `/api/chat/communities/${communityId}`,
        )
        if (!mounted) return
        setMessages(Array.isArray(data.messages) ? data.messages : [])
      } catch (err) {
        if (!mounted) return
        setError(getErrorMessage(err))
      } finally {
        if (mounted) setLoadingMessages(false)
      }
    }
    void load()
    void api.post(`/api/chat/communities/${communityId}/read`).catch(() => {})

    const socket = getSocket()

    function join() {
      socket?.emit("join_community", { communityId })
    }

    function leave() {
      socket?.emit("leave_community", { communityId })
    }

    function onCommunityMessage(payload: {
      communityId: string
      message: CommunityMessage
    }) {
      if (!payload || payload.communityId !== communityId) return
      setMessages((prev) => {
        const map = new Map(prev.map((m) => [m._id, m]))
        const isNew = !map.has(payload.message._id)
        map.set(payload.message._id, payload.message)
        if (isNew && payload.message.sender?._id !== currentUserId)
          playMessageSound()
        return [...map.values()]
      })
      if (payload.message.sender?._id !== currentUserId) {
        void api
          .post(`/api/chat/communities/${communityId}/read`)
          .catch(() => {})
      }
    }

    function onCommunityMessageUpdated(payload: {
      communityId: string
      message: CommunityMessage
    }) {
      if (!payload || payload.communityId !== communityId) return
      setMessages((prev) =>
        prev.map((m) =>
          m._id === payload.message._id ? payload.message : m,
        ),
      )
    }

    function onCommunityMessageUnsent(payload: {
      communityId: string
      message: CommunityMessage
    }) {
      if (!payload || payload.communityId !== communityId) return
      setMessages((prev) =>
        prev.map((m) =>
          m._id === payload.message._id ? payload.message : m,
        ),
      )
    }

    if (socket) {
      if (socket.connected) join()
      socket.on("connect", join)
      socket.on("community_message", onCommunityMessage)
      socket.on("community_message_updated", onCommunityMessageUpdated)
      socket.on("community_message_unsent", onCommunityMessageUnsent)
    }

    return () => {
      mounted = false
      if (socket) {
        socket.off("connect", join)
        leave()
        socket.off("community_message", onCommunityMessage)
        socket.off("community_message_updated", onCommunityMessageUpdated)
        socket.off("community_message_unsent", onCommunityMessageUnsent)
      }
    }
  }, [activeId, currentUserId, setMessages, setLoadingMessages, setError])
}
