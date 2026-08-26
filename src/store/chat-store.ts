import { create } from "zustand"
import { api } from "@/lib/api"
import { getErrorMessage } from "@/lib/errors"
import { loadSetting } from "@/components/user/shared/utils"
import { CHAT_PAGE_SIZE } from "@/components/user/chat/utils"
import type { ChatUser, Conversation, DirectMessage, ReplySnapshot } from "@/components/user/chat/types"

// Module-level ref to prevent concurrent older-message fetches
let loadingOlderRef = false

interface ChatState {
  // Route (synced by useChatState hook)
  username: string | null
  isTherry: boolean

  // Conversations
  conversations: Conversation[]
  loadingList: boolean

  // Suggestions
  suggestions: ChatUser[]
  loadingSuggestions: boolean

  // Search
  searchQuery: string
  searchResults: ChatUser[]
  searching: boolean

  // Active partner
  partner: ChatUser | null

  // Messages
  messages: DirectMessage[]
  loadingMessages: boolean
  nextCursor: string | null
  hasOlderMessages: boolean
  loadingOlder: boolean

  // Input
  newMessage: string
  sending: boolean
  error: string | null

  // Settings
  showPreviews: boolean
  enterToSend: boolean

  // Message action state
  deleting: string | null
  editingId: string | null
  editingContent: string
  showHistoryFor: string | null
  menuOpenId: string | null
  selectedTimestampMessage: string | null
  mobileSidebarOpen: boolean
  replyToMessage: ReplySnapshot | null
}

interface ChatActions {
  setUsername: (username: string | null) => void
  setIsTherry: (v: boolean) => void
  setConversations: (v: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void
  setLoadingList: (v: boolean) => void
  setSuggestions: (v: ChatUser[]) => void
  setLoadingSuggestions: (v: boolean) => void
  setSearchQuery: (v: string) => void
  setSearchResults: (v: ChatUser[]) => void
  setSearching: (v: boolean) => void
  setPartner: (v: ChatUser | null) => void
  setMessages: (v: DirectMessage[] | ((prev: DirectMessage[]) => DirectMessage[])) => void
  setLoadingMessages: (v: boolean) => void
  setNextCursor: (v: string | null) => void
  setHasOlderMessages: (v: boolean) => void
  setLoadingOlder: (v: boolean) => void
  setNewMessage: (v: string) => void
  setSending: (v: boolean) => void
  setError: (v: string | null) => void
  setShowPreviews: (v: boolean) => void
  setEnterToSend: (v: boolean) => void
  setDeleting: (v: string | null) => void
  setEditingId: (v: string | null) => void
  setEditingContent: (v: string) => void
  setShowHistoryFor: (v: string | null) => void
  setMenuOpenId: (v: string | null) => void
  setSelectedTimestampMessage: (v: string | null) => void
  setMobileSidebarOpen: (v: boolean) => void
  setReplyToMessage: (v: ReplySnapshot | null) => void

  // Compound actions
  sendMessage: () => Promise<void>
  sendVoiceNote: (blob: Blob, duration: number) => Promise<void>
  startReply: (msg: DirectMessage) => void
  cancelReply: () => void
  handleUnsend: (messageId: string) => Promise<void>
  startEdit: (msg: DirectMessage) => void
  handleSaveEdit: () => Promise<void>
  cancelEdit: () => void
  toggleTimestamp: (id: string) => void
  loadOlderMessages: () => Promise<void>
  openDM: (user: ChatUser) => void
  resetChat: () => void
}

export const useChatStore = create<ChatState & ChatActions>()((set, get) => ({
  // ── Initial state ──
  username: null,
  isTherry: false,
  conversations: [],
  loadingList: true,
  suggestions: [],
  loadingSuggestions: false,
  searchQuery: "",
  searchResults: [],
  searching: false,
  partner: null,
  messages: [],
  loadingMessages: false,
  nextCursor: null,
  hasOlderMessages: false,
  loadingOlder: false,
  newMessage: "",
  sending: false,
  error: null,
  showPreviews: loadSetting("messagePreviews", true),
  enterToSend: loadSetting("enterToSend", true),
  deleting: null,
  editingId: null,
  editingContent: "",
  showHistoryFor: null,
  menuOpenId: null,
  selectedTimestampMessage: null,
  mobileSidebarOpen: false,
  replyToMessage: null,

  // ── Simple setters ──
  setUsername: (username) => set({ username }),
  setIsTherry: (v) => set({ isTherry: v }),
  setConversations: (v) => {
    if (typeof v === "function") {
      set((state) => ({ conversations: v(state.conversations) }))
    } else {
      set({ conversations: v })
    }
  },
  setLoadingList: (v) => set({ loadingList: v }),
  setSuggestions: (v) => set({ suggestions: v }),
  setLoadingSuggestions: (v) => set({ loadingSuggestions: v }),
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    if (query.length < 3) set({ searchResults: [] })
  },
  setSearchResults: (v) => set({ searchResults: v }),
  setSearching: (v) => set({ searching: v }),
  setPartner: (v) => set({ partner: v }),
  setMessages: (v) => setArrayState(set, "messages", v),
  setLoadingMessages: (v) => set({ loadingMessages: v }),
  setNextCursor: (v) => set({ nextCursor: v }),
  setHasOlderMessages: (v) => set({ hasOlderMessages: v }),
  setLoadingOlder: (v) => set({ loadingOlder: v }),
  setNewMessage: (v) => set({ newMessage: v }),
  setSending: (v) => set({ sending: v }),
  setError: (v) => set({ error: v }),
  setShowPreviews: (v) => set({ showPreviews: v }),
  setEnterToSend: (v) => set({ enterToSend: v }),
  setDeleting: (v) => set({ deleting: v }),
  setEditingId: (v) => set({ editingId: v }),
  setEditingContent: (v) => set({ editingContent: v }),
  setShowHistoryFor: (v) => set({ showHistoryFor: v }),
  setMenuOpenId: (v) => set({ menuOpenId: v }),
  setSelectedTimestampMessage: (v) => set({ selectedTimestampMessage: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  setReplyToMessage: (v) => set({ replyToMessage: v }),

  // ── Compound actions ──
  sendMessage: async () => {
    const { newMessage, partner, replyToMessage } = get()
    if (!newMessage.trim() || !partner) return
    set({ sending: true, error: null })
    try {
      const payload: { recipientId: string; content: string; replyToMessageId?: string } = {
        recipientId: partner._id,
        content: newMessage.trim(),
      }
      if (replyToMessage) {
        payload.replyToMessageId = replyToMessage._id
      }
      const { data } = await api.post<DirectMessage>("/api/chat/send", payload)
      set((state) => ({
        messages: [...state.messages, data],
        newMessage: "",
        replyToMessage: null,
      }))
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ sending: false })
    }
  },

  sendVoiceNote: async (blob, duration) => {
    const { partner, replyToMessage } = get()
    if (!partner) return
    set({ sending: true })
    try {
      const formData = new FormData()
      formData.append("audio", blob, "voice.webm")
      formData.append("recipientId", partner._id)
      formData.append("duration", String(duration))
      if (replyToMessage) {
        formData.append("replyToMessageId", replyToMessage._id)
      }
      const { data } = await api.post<DirectMessage>("/api/chat/voice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      set((state) => ({ messages: [...state.messages, data], replyToMessage: null }))
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ sending: false })
    }
  },

  startReply: (msg) => {
    const sender = msg.sender
    set({
      replyToMessage: {
        _id: msg._id,
        senderUsername: sender.username,
        senderAvatar: sender.avatar,
        content: msg.type === "voice" ? "\ud83c\udfa4 Voice message" : msg.content.slice(0, 150),
        type: msg.type || "text",
      },
      menuOpenId: null,
    })
  },

  cancelReply: () => set({ replyToMessage: null }),

  handleUnsend: async (messageId) => {
    set({ deleting: messageId })
    try {
      await api.delete(`/api/chat/unsend/${messageId}`)
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, unsent: true, content: "Message unsent" } : m
        ),
      }))
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ deleting: null })
    }
  },

  startEdit: (msg) => {
    set({ editingId: msg._id, editingContent: msg.content, menuOpenId: null })
  },

  handleSaveEdit: async () => {
    const { editingId, editingContent } = get()
    if (!editingId || !editingContent.trim()) return
    try {
      const { data } = await api.put<DirectMessage>(`/api/chat/edit/${editingId}`, {
        content: editingContent.trim(),
      })
      set((state) => ({
        messages: state.messages.map((m) => (m._id === editingId ? data : m)),
        editingId: null,
        editingContent: "",
      }))
    } catch (err) {
      set({ error: getErrorMessage(err) })
    }
  },

  cancelEdit: () => set({ editingId: null, editingContent: "" }),

  toggleTimestamp: (id) => {
    set((state) => ({
      selectedTimestampMessage: state.selectedTimestampMessage === id ? null : id,
    }))
  },

  loadOlderMessages: async () => {
    const { partner, nextCursor } = get()
    if (!partner || !nextCursor || loadingOlderRef) return
    loadingOlderRef = true
    set({ loadingOlder: true })
    try {
      const { data } = await api.get<{ data: DirectMessage[]; nextCursor: string | null }>(
        `/api/chat/conversation/${partner._id}?cursor=${encodeURIComponent(nextCursor)}&limit=${CHAT_PAGE_SIZE}`
      )
      const older = Array.isArray(data.data) ? data.data : []
      set((state) => {
        const map = new Map<string, DirectMessage>()
        for (const m of older) map.set(m._id, m)
        for (const m of state.messages) map.set(m._id, m)
        return {
          messages: [...map.values()],
          nextCursor: data.nextCursor ?? null,
          hasOlderMessages: !!data.nextCursor,
        }
      })
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      loadingOlderRef = false
      set({ loadingOlder: false })
    }
  },

  openDM: (user) => {
    set({ searchQuery: "", searchResults: [], mobileSidebarOpen: false })
  },

  resetChat: () => {
    set({
      partner: null,
      messages: [],
      nextCursor: null,
      hasOlderMessages: false,
      loadingOlder: false,
      error: null,
      editingId: null,
      editingContent: "",
    })
  },
}))
