import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { getErrorMessage } from "./utils"
import type { Community, CommunityMessage } from "./types"

export function useCommunityState() {
  const { inviteKey } = useParams<{ inviteKey: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)

  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<Community | null>(null)
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [selectedTimestampMessage, setSelectedTimestampMessage] = useState<string | null>(null)
  const [screenshotProtected, setScreenshotProtected] = useState(true)

  async function sendMessage() {
    if (!newMessage.trim() || !active) return
    setSending(true)
    try {
      const { data } = await api.post<CommunityMessage>(
        `/api/chat/communities/${active._id}/messages`,
        { content: newMessage.trim() }
      )
      setMessages((prev) => [...prev, data])
      setNewMessage("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  function selectCommunity(c: Community) {
    setActive(c)
    navigate(`/community/${c.inviteKey}`)
  }

  return {
    inviteKey, navigate, currentUser,
    communities, setCommunities, loading, setLoading, error, setError,
    active, setActive, messages, setMessages, loadingMessages, setLoadingMessages,
    newMessage, setNewMessage, sending, setSending,
    showCreate, setShowCreate, showJoin, setShowJoin,
    showSettings, setShowSettings,
    mobileSidebarOpen, setMobileSidebarOpen,
    selectedTimestampMessage, setSelectedTimestampMessage,
    screenshotProtected, setScreenshotProtected,
    sendMessage, selectCommunity,
  }
}
