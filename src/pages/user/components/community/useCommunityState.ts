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
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

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

  async function handleUnsend(messageId: string) {
    if (!active) return
    setDeleting(messageId)
    try {
      await api.delete(`/api/chat/communities/${active._id}/messages/${messageId}`)
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, unsent: true, content: "[Message unsent]" } : m
        )
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeleting(null)
    }
  }

  function startEdit(msg: CommunityMessage) {
    setEditingId(msg._id)
    setEditingContent(msg.content)
    setMenuOpenId(null)
  }

  async function handleSaveEdit() {
    if (!editingId || !editingContent.trim() || !active) return
    try {
      const { data } = await api.put<CommunityMessage>(
        `/api/chat/communities/${active._id}/messages/${editingId}`,
        { content: editingContent.trim() }
      )
      setMessages((prev) => prev.map((m) => (m._id === editingId ? data : m)))
      setEditingId(null)
      setEditingContent("")
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingContent("")
  }

  function toggleTimestamp(id: string) {
    setSelectedTimestampMessage((prev) => (prev === id ? null : id))
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
    toggleTimestamp,
    screenshotProtected, setScreenshotProtected,
    sendMessage, selectCommunity,
    deleting, editingId, editingContent, setEditingContent,
    showHistoryFor, setShowHistoryFor, menuOpenId, setMenuOpenId,
    handleUnsend, startEdit, handleSaveEdit, cancelEdit,
  }
}
