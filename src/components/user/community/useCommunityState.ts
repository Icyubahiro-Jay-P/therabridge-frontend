import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { getErrorMessage } from "./utils"
import type { Community, CommunityMessage } from "./types"
import type { ReplySnapshot } from "../chat/types"

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
  const [showJoin, setShowJoin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [selectedTimestampMessage, setSelectedTimestampMessage] = useState<string | null>(null)
  const [screenshotProtected, setScreenshotProtected] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [replyToMessage, setReplyToMessage] = useState<ReplySnapshot | null>(null)

  async function sendMessage() {
    if (!newMessage.trim() || !active) return
    setSending(true)
    try {
      const payload: { content: string; replyToMessageId?: string } = { content: newMessage.trim() }
      if (replyToMessage) {
        payload.replyToMessageId = replyToMessage._id
      }
      const { data } = await api.post<CommunityMessage>(
        `/api/chat/communities/${active._id}/messages`,
        payload
      )
      setMessages((prev) => [...prev, data])
      setNewMessage("")
      setReplyToMessage(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  async function sendVoiceNote(blob: Blob, duration: number) {
    if (!active) return
    setSending(true)
    try {
      const formData = new FormData()
      formData.append("audio", blob, "voice.webm")
      formData.append("duration", String(duration))
      if (replyToMessage) {
        formData.append("replyToMessageId", replyToMessage._id)
      }
      const { data } = await api.post<CommunityMessage>(
        `/api/chat/communities/${active._id}/voice`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      setMessages((prev) => [...prev, data])
      setReplyToMessage(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  function startReply(msg: CommunityMessage) {
    setReplyToMessage({
      _id: msg._id,
      senderUsername: msg.sender.username,
      senderAvatar: msg.sender.avatar,
      content: msg.type === "voice" ? "🎤 Voice message" : msg.content.slice(0, 150),
      type: msg.type || "text",
    })
    setMenuOpenId(null)
  }

  function cancelReply() { setReplyToMessage(null) }

  function selectCommunity(c: Community) {
    setActive(c)
    navigate(`/community/${c.inviteKey}`)
  }

  function onCreated(c: Community) {
    setCommunities((prev) => (prev.find((p) => p._id === c._id) ? prev : [c, ...prev]))
    selectCommunity(c)
  }

  async function leaveActive() {
    if (!active) return
    setDeleting(active._id)
    try {
      await api.post(`/api/chat/communities/${active._id}/leave`)
      setCommunities((prev) => prev.filter((c) => c._id !== active._id))
      setActive(null)
      navigate("/community")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeleting(null)
    }
  }

  async function deleteActive() {
    if (!active) return
    setDeleting(active._id)
    try {
      await api.delete(`/api/chat/communities/${active._id}`)
      setCommunities((prev) => prev.filter((c) => c._id !== active._id))
      setActive(null)
      navigate("/community")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeleting(null)
    }
  }

  async function handleUnsend(messageId: string) {
    if (!active) return
    setDeleting(messageId)
    try {
      await api.delete(`/api/chat/communities/${active._id}/messages/${messageId}`)
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, unsent: true, content: "Message unsent" } : m
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
    replyToMessage, setReplyToMessage,
    showJoin, setShowJoin,
    showCreate, setShowCreate,
    showSettings, setShowSettings,
    mobileSidebarOpen, setMobileSidebarOpen,
    selectedTimestampMessage, setSelectedTimestampMessage,
    toggleTimestamp,
    screenshotProtected, setScreenshotProtected,
    sendMessage, sendVoiceNote, startReply, cancelReply, selectCommunity, onCreated, leaveActive, deleteActive,
    deleting, editingId, editingContent, setEditingContent,
    showHistoryFor, setShowHistoryFor, menuOpenId, setMenuOpenId,
    handleUnsend, startEdit, handleSaveEdit, cancelEdit,
  }
}
