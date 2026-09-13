import { create } from "zustand"
import { api } from "@/lib/api"
import { getErrorMessage } from "@/lib/errors"
import type { Community, CommunityMessage } from "@/components/user/community/types"
import type { ReplySnapshot } from "@/components/user/chat/types"
import { CHAT_PAGE_SIZE } from "@/components/user/chat/utils"

// Per-community guard against concurrent/overlapping older-message fetches -
// keyed by community id so loading one room's history can never block, or
// get spliced into, another's (mirrors chat-store's loadingOlderIds).
const loadingOlderIds = new Set<string>()

interface CommunityState {
  // Route (synced by useCommunityState hook)
  inviteKey: string | null

  // Communities list
  communities: Community[]
  loading: boolean
  error: string | null

  // Active community
  active: Community | null

  // Messages
  messages: CommunityMessage[]
  loadingMessages: boolean
  nextCursor: string | null
  hasOlderMessages: boolean
  loadingOlder: boolean
  newMessage: string
  sending: boolean

  // Modals
  showJoin: boolean
  showCreate: boolean
  showSettings: boolean

  // UI state
  mobileSidebarOpen: boolean
  selectedTimestampMessage: string | null
  screenshotProtected: boolean
  deleting: string | null

  // Message action state
  editingId: string | null
  editingContent: string
  showHistoryFor: string | null
  menuOpenId: string | null
  replyToMessage: ReplySnapshot | null
}

interface CommunityActions {
  setInviteKey: (v: string | null) => void
  setCommunities: (v: Community[] | ((prev: Community[]) => Community[])) => void
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setActive: (v: Community | null) => void
  setMessages: (v: CommunityMessage[] | ((prev: CommunityMessage[]) => CommunityMessage[])) => void
  setLoadingMessages: (v: boolean) => void
  setNextCursor: (v: string | null) => void
  setHasOlderMessages: (v: boolean) => void
  setLoadingOlder: (v: boolean) => void
  setNewMessage: (v: string) => void
  setSending: (v: boolean) => void
  setShowJoin: (v: boolean) => void
  setShowCreate: (v: boolean) => void
  setShowSettings: (v: boolean) => void
  setMobileSidebarOpen: (v: boolean) => void
  setSelectedTimestampMessage: (v: string | null) => void
  setScreenshotProtected: (v: boolean) => void
  setDeleting: (v: string | null) => void
  setEditingId: (v: string | null) => void
  setEditingContent: (v: string) => void
  setShowHistoryFor: (v: string | null) => void
  setMenuOpenId: (v: string | null) => void
  setReplyToMessage: (v: ReplySnapshot | null) => void

  // Compound actions
  sendMessage: () => Promise<void>
  sendVoiceNote: (blob: Blob, duration: number) => Promise<void>
  startReply: (msg: CommunityMessage) => void
  cancelReply: () => void
  selectCommunity: (c: Community) => void
  onCreated: (c: Community) => void
  leaveActive: () => Promise<void>
  deleteActive: () => Promise<void>
  handleUnsend: (messageId: string) => Promise<void>
  startEdit: (msg: CommunityMessage) => void
  handleSaveEdit: () => Promise<void>
  cancelEdit: () => void
  toggleTimestamp: (id: string) => void
  loadOlderMessages: () => Promise<void>
}

export const useCommunityStore = create<CommunityState & CommunityActions>()((set, get) => ({
  // ── Initial state ──
  inviteKey: null,
  communities: [],
  loading: true,
  error: null,
  active: null,
  messages: [],
  loadingMessages: false,
  nextCursor: null,
  hasOlderMessages: false,
  loadingOlder: false,
  newMessage: "",
  sending: false,
  showJoin: false,
  showCreate: false,
  showSettings: false,
  mobileSidebarOpen: false,
  selectedTimestampMessage: null,
  screenshotProtected: true,
  deleting: null,
  editingId: null,
  editingContent: "",
  showHistoryFor: null,
  menuOpenId: null,
  replyToMessage: null,

  // ── Simple setters ──
  setInviteKey: (v) => set({ inviteKey: v }),
  setCommunities: (v) => {
    if (typeof v === "function") {
      set((state) => ({ communities: v(state.communities) }))
    } else {
      set({ communities: v })
    }
  },
  setLoading: (v) => set({ loading: v }),
  setError: (v) => set({ error: v }),
  setActive: (v) => set({ active: v }),
  setMessages: (v) => {
    if (typeof v === "function") {
      set((state) => ({ messages: v(state.messages) }))
    } else {
      set({ messages: v })
    }
  },
  setLoadingMessages: (v) => set({ loadingMessages: v }),
  setNextCursor: (v) => set({ nextCursor: v }),
  setHasOlderMessages: (v) => set({ hasOlderMessages: v }),
  setLoadingOlder: (v) => set({ loadingOlder: v }),
  setNewMessage: (v) => set({ newMessage: v }),
  setSending: (v) => set({ sending: v }),
  setShowJoin: (v) => set({ showJoin: v }),
  setShowCreate: (v) => set({ showCreate: v }),
  setShowSettings: (v) => set({ showSettings: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  setSelectedTimestampMessage: (v) => set({ selectedTimestampMessage: v }),
  setScreenshotProtected: (v) => set({ screenshotProtected: v }),
  setDeleting: (v) => set({ deleting: v }),
  setEditingId: (v) => set({ editingId: v }),
  setEditingContent: (v) => set({ editingContent: v }),
  setShowHistoryFor: (v) => set({ showHistoryFor: v }),
  setMenuOpenId: (v) => set({ menuOpenId: v }),
  setReplyToMessage: (v) => set({ replyToMessage: v }),

  // ── Compound actions ──
  sendMessage: async () => {
    const { newMessage, active, replyToMessage, sending } = get()
    if (!newMessage.trim() || !active || sending) return
    set({ sending: true, error: null })
    try {
      const payload: { content: string; replyToMessageId?: string } = {
        content: newMessage.trim(),
      }
      if (replyToMessage) {
        payload.replyToMessageId = replyToMessage._id
      }
      const { data } = await api.post<CommunityMessage>(
        `/api/chat/communities/${active._id}/messages`,
        payload,
      )
      set((state) => {
        // Upsert by _id: the real-time socket echo of this same message can
        // arrive before this response does, and would otherwise duplicate it.
        const map = new Map(state.messages.map((m) => [m._id, m]))
        map.set(data._id, data)
        return { messages: [...map.values()], newMessage: "", replyToMessage: null }
      })
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ sending: false })
    }
  },

  sendVoiceNote: async (blob, duration) => {
    const { active, replyToMessage, sending } = get()
    if (!active || sending) return
    set({ sending: true, error: null })
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
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      set((state) => {
        const map = new Map(state.messages.map((m) => [m._id, m]))
        map.set(data._id, data)
        return { messages: [...map.values()], replyToMessage: null }
      })
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ sending: false })
    }
  },

  startReply: (msg) => {
    set({
      replyToMessage: {
        _id: msg._id,
        senderUsername: msg.sender.username,
        senderAvatar: msg.sender.avatar,
        content: msg.type === "voice" ? "\ud83c\udfa4 Voice message" : msg.content.slice(0, 150),
        type: msg.type || "text",
      },
      menuOpenId: null,
    })
  },

  cancelReply: () => set({ replyToMessage: null }),

  selectCommunity: (c) =>
    set({
      active: c,
      // Reply/draft/menu state belongs to whatever community was open
      // before - carrying it over would attach a reply meant for one
      // community's message to a message posted in another.
      newMessage: "",
      replyToMessage: null,
      menuOpenId: null,
      selectedTimestampMessage: null,
      showHistoryFor: null,
      editingId: null,
      editingContent: "",
      error: null,
    }),

  onCreated: (c) => {
    set((state) => ({
      communities: state.communities.find((p) => p._id === c._id)
        ? state.communities
        : [c, ...state.communities],
      active: c,
    }))
  },

  leaveActive: async () => {
    const { active } = get()
    if (!active) return
    set({ deleting: active._id })
    try {
      await api.post(`/api/chat/communities/${active._id}/leave`)
      set((state) => ({
        communities: state.communities.filter((c) => c._id !== active._id),
        active: null,
      }))
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ deleting: null })
    }
  },

  deleteActive: async () => {
    const { active } = get()
    if (!active) return
    set({ deleting: active._id })
    try {
      await api.delete(`/api/chat/communities/${active._id}`)
      set((state) => ({
        communities: state.communities.filter((c) => c._id !== active._id),
        active: null,
      }))
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ deleting: null })
    }
  },

  handleUnsend: async (messageId) => {
    const { active } = get()
    if (!active) return
    set({ deleting: messageId })
    try {
      await api.delete(`/api/chat/communities/${active._id}/messages/${messageId}`)
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
    const { editingId, editingContent, active, sending } = get()
    if (!editingId || !editingContent.trim() || !active || sending) return
    set({ sending: true })
    try {
      const { data } = await api.put<CommunityMessage>(
        `/api/chat/communities/${active._id}/messages/${editingId}`,
        { content: editingContent.trim() },
      )
      set((state) => ({
        messages: state.messages.map((m) => (m._id === editingId ? data : m)),
        editingId: null,
        editingContent: "",
      }))
    } catch (err) {
      set({ error: getErrorMessage(err) })
    } finally {
      set({ sending: false })
    }
  },

  cancelEdit: () => set({ editingId: null, editingContent: "" }),

  toggleTimestamp: (id) => {
    set((state) => ({
      selectedTimestampMessage: state.selectedTimestampMessage === id ? null : id,
    }))
  },
}))
