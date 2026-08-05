import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { getErrorMessage, loadSetting, CHAT_PAGE_SIZE } from "./utils"
import type { ChatUser, Conversation, DirectMessage } from "./types"

export function useChatState() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)
  const isTherry = username === "therry"
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [suggestions, setSuggestions] = useState<ChatUser[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])
  const [searching, setSearching] = useState(false)
  const [partner, setPartner] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasOlderMessages, setHasOlderMessages] = useState(false)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreviews, setShowPreviews] = useState(() => loadSetting("messagePreviews", true))
  const [enterToSend, setEnterToSend] = useState(() => loadSetting("enterToSend", true))
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [selectedTimestampMessage, setSelectedTimestampMessage] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const loadingOlderRef = useRef(false)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])
  const suggestionsLoadedRef = useRef(false)
  useEffect(() => {
    if (loadingList || suggestionsLoadedRef.current) return
    suggestionsLoadedRef.current = true
    let mounted = true
    void (async () => {
      setLoadingSuggestions(true)
      try {
        const { data } = await api.get<ChatUser[]>("/api/chat/suggestions")
        if (mounted) setSuggestions(Array.isArray(data) ? data : [])
      } catch {
        if (mounted) setSuggestions([])
      } finally {
        if (mounted) setLoadingSuggestions(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [loadingList])
  useEffect(() => {
    if (searchQuery.length < 3) { setSearchResults([]); return }
    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await api.get<ChatUser[]>(`/api/chat/search?q=${encodeURIComponent(searchQuery)}`)
        setSearchResults(data)
      } catch { setSearchResults([]) }
      finally { setSearching(false) }
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchQuery])
  useEffect(() => {
    function handleClick() { setMenuOpenId(null) }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  async function sendMessage() {
    if (!newMessage.trim() || !partner) return
    setSending(true)
    try {
      const { data } = await api.post<DirectMessage>("/api/chat/send", { recipientId: partner._id, content: newMessage.trim() })
      setMessages((prev) => [...prev, data])
      setNewMessage("")
    } catch (err) { setError(getErrorMessage(err)) }
    finally { setSending(false) }
  }
  async function handleUnsend(messageId: string) {
    setDeleting(messageId)
    try {
      await api.delete(`/api/chat/unsend/${messageId}`)
      setMessages((prev) => prev.map((m) => m._id === messageId ? { ...m, unsent: true, content: "Message unsent" } : m))
    } catch (err) { setError(getErrorMessage(err)) }
    finally { setDeleting(null) }
  }
  function startEdit(msg: DirectMessage) { setEditingId(msg._id); setEditingContent(msg.content); setMenuOpenId(null) }
  async function handleSaveEdit() {
    if (!editingId || !editingContent.trim()) return
    try {
      const { data } = await api.put<DirectMessage>(`/api/chat/edit/${editingId}`, { content: editingContent.trim() })
      setMessages((prev) => prev.map((m) => (m._id === editingId ? data : m)))
      setEditingId(null); setEditingContent("")
    } catch (err) { setError(getErrorMessage(err)) }
  }
  function openDM(user: ChatUser) { navigate(`/chat/${user.username}`); setSearchQuery(""); setSearchResults([]); setMobileSidebarOpen(false) }
  function cancelEdit() { setEditingId(null); setEditingContent("") }
  function toggleTimestamp(id: string) { setSelectedTimestampMessage((prev) => (prev === id ? null : id)) }

  async function loadOlderMessages() {
    if (!partner || !nextCursor || loadingOlderRef.current) return
    loadingOlderRef.current = true
    setLoadingOlder(true)
    try {
      const { data } = await api.get<{ data: DirectMessage[]; nextCursor: string | null }>(
        `/api/chat/conversation/${partner._id}?cursor=${encodeURIComponent(nextCursor)}&limit=${CHAT_PAGE_SIZE}`
      )
      const older = Array.isArray(data.data) ? data.data : []
      setMessages((prev) => {
        const map = new Map<string, DirectMessage>()
        for (const m of older) map.set(m._id, m)
        for (const m of prev) map.set(m._id, m)
        return [...map.values()]
      })
      setNextCursor(data.nextCursor ?? null)
      setHasOlderMessages(!!data.nextCursor)
    } catch (err) { setError(getErrorMessage(err)) }
    finally {
      loadingOlderRef.current = false
      setLoadingOlder(false)
    }
  }

  return {
    currentUser, username, isTherry, navigate, conversations, setConversations, loadingList, setLoadingList,
    suggestions, setSuggestions, loadingSuggestions, setLoadingSuggestions,
    searchQuery, setSearchQuery, searchResults, setSearchResults, searching, setSearching,
    partner, setPartner, messages, setMessages, loadingMessages, setLoadingMessages,
    nextCursor, setNextCursor, hasOlderMessages, setHasOlderMessages, loadingOlder, setLoadingOlder,
    newMessage, setNewMessage, sending, setSending, error, setError,
    showPreviews, setShowPreviews, enterToSend, setEnterToSend,
    deleting, setDeleting, editingId, setEditingId, editingContent, setEditingContent,
    showHistoryFor, setShowHistoryFor, menuOpenId, setMenuOpenId,
    selectedTimestampMessage, setSelectedTimestampMessage, mobileSidebarOpen, setMobileSidebarOpen,
    messagesEndRef, sendMessage, handleUnsend, startEdit, handleSaveEdit, openDM, cancelEdit, toggleTimestamp,
    loadOlderMessages,
  }
}
