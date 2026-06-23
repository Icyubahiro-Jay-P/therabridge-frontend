import { useEffect, useRef, useState } from "react"
import {
  Hash,
  KeyRound,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Send,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

interface ChatUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  avatar?: string | null
}

interface DirectMessage {
  _id: string
  sender: ChatUser
  recipient: ChatUser
  content: string
  read: boolean
  createdAt: string
}

interface Conversation {
  partner: ChatUser
  lastMessage: DirectMessage
  unread: number
}

interface CommunityMessage {
  _id: string
  sender: ChatUser
  content: string
  createdAt: string
}

interface Community {
  _id: string
  name: string
  description: string
  owner: ChatUser
  members: ChatUser[]
  inviteKey: string
  messages: CommunityMessage[]
}

type ActiveThread =
  | { kind: "dm"; partner: ChatUser }
  | { kind: "community"; community: Community }

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function Avatar({ user, size = "md" }: { user: ChatUser; size?: "sm" | "md" }) {
  const initials =
    (user.firstName[0] ?? "") + (user.lastName[0] ?? "")
  const colors = [
    "bg-emerald-500",
    "bg-teal-500",
    "bg-sky-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-orange-500",
  ]
  const color = colors[user.username.charCodeAt(0) % colors.length]

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        color,
        size === "sm" ? "size-8 text-xs" : "size-10 text-sm"
      )}
    >
      {initials.toUpperCase()}
    </span>
  )
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString()
}

// ──────────────────────────────────────────────────────────────────────────────
// Create Community Modal
// ──────────────────────────────────────────────────────────────────────────────

function CreateCommunityModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (c: Community) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post<Community>("/api/chat/communities", {
        name,
        description,
      })
      onCreate(data)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Create a community
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Community name
            </label>
            <Input
              placeholder="My Wellness Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (optional)
            </label>
            <Input
              placeholder="A safe space to share…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Create community"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Join Community Modal
// ──────────────────────────────────────────────────────────────────────────────

function JoinCommunityModal({
  onClose,
  onJoin,
}: {
  onClose: () => void
  onJoin: (c: Community) => void
}) {
  const [key, setKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post<{ community: Community }>(
        "/api/chat/communities/join",
        { inviteKey: key.trim().toUpperCase() }
      )
      onJoin(data.community)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Join with invite key
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Invite key (8 characters)
            </label>
            <div className="relative">
              <KeyRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="e.g. AB12CD34"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                required
                disabled={loading}
                className="pl-9 uppercase tracking-widest"
                maxLength={8}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Join community"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Main ChatPage
// ──────────────────────────────────────────────────────────────────────────────

export function ChatPage() {
  const currentUser = useAuthStore((state) => state.user)

  // Sidebar state
  const [tab, setTab] = useState<"dms" | "communities">("dms")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [loadingList, setLoadingList] = useState(true)

  // User search (for new DM)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])
  const [searching, setSearching] = useState(false)

  // Active thread
  const [active, setActive] = useState<ActiveThread | null>(null)
  const [messages, setMessages] = useState<DirectMessage[] | CommunityMessage[]>([])
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Message input
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)

  // Modals
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  // Error
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load sidebar list
  useEffect(() => {
    async function load() {
      setLoadingList(true)
      try {
        if (tab === "dms") {
          const { data } = await api.get<Conversation[]>("/api/chat/conversations")
          setConversations(data)
        } else {
          const { data } = await api.get<Community[]>("/api/chat/communities")
          setCommunities(data)
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoadingList(false)
      }
    }
    void load()
  }, [tab])

  // Load messages for active thread
  useEffect(() => {
    if (!active) return
    async function loadMessages() {
      setLoadingMessages(true)
      setMessages([])
      try {
        if (active?.kind === "dm") {
          const { data } = await api.get<DirectMessage[]>(
            `/api/chat/conversation/${active.partner._id}`
          )
          setMessages(data)
        } else if (active?.kind === "community") {
          const { data } = await api.get<Community>(
            `/api/chat/communities/${active.community._id}`
          )
          setMessages(data.messages)
          setActiveCommunity(data)
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoadingMessages(false)
      }
    }
    void loadMessages()
  }, [active])

  // Search users
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await api.get<ChatUser[]>(
          `/api/chat/search?q=${encodeURIComponent(searchQuery)}`
        )
        setSearchResults(data)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  async function sendMessage() {
    if (!newMessage.trim() || !active) return
    setSending(true)
    try {
      if (active.kind === "dm") {
        const { data } = await api.post<DirectMessage>("/api/chat/send", {
          recipientId: active.partner._id,
          content: newMessage.trim(),
        })
        setMessages((prev) => [...prev, data] as DirectMessage[])
      } else {
        const { data } = await api.post<CommunityMessage>(
          `/api/chat/communities/${active.community._id}/messages`,
          { content: newMessage.trim() }
        )
        setMessages((prev) => [...prev, data] as CommunityMessage[])
      }
      setNewMessage("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  function openDM(partner: ChatUser) {
    setActive({ kind: "dm", partner })
    setSearchQuery("")
    setSearchResults([])
  }

  function openCommunity(community: Community) {
    setActive({ kind: "community", community })
  }

  const dmMessages = messages as DirectMessage[]
  const communityMessages = messages as CommunityMessage[]

  return (
    <>
      {showCreate && (
        <CreateCommunityModal
          onClose={() => setShowCreate(false)}
          onCreate={(c) => {
            setCommunities((prev) => [c, ...prev])
            openCommunity(c)
          }}
        />
      )}
      {showJoin && (
        <JoinCommunityModal
          onClose={() => setShowJoin(false)}
          onJoin={(c) => {
            setCommunities((prev) =>
              prev.find((p) => p._id === c._id) ? prev : [c, ...prev]
            )
            openCommunity(c)
          }}
        />
      )}

      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
        {/* ── Sidebar ── */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700/60">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700/60">
            <button
              onClick={() => setTab("dms")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors",
                tab === "dms"
                  ? "border-b-2 border-emerald-600 text-emerald-700 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              )}
            >
              <MessageCircle className="size-4" />
              Direct
            </button>
            <button
              onClick={() => setTab("communities")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors",
                tab === "communities"
                  ? "border-b-2 border-emerald-600 text-emerald-700 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              )}
            >
              <Users className="size-4" />
              Rooms
            </button>
          </div>

          {/* Search / actions */}
          <div className="p-3">
            {tab === "dms" ? (
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowCreate(true)}
                  className="flex-1 bg-emerald-600 text-xs hover:bg-emerald-700"
                >
                  <Plus className="size-3.5" /> New
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowJoin(true)}
                  className="flex-1 text-xs"
                >
                  <KeyRound className="size-3.5" /> Join
                </Button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {/* Search results */}
            {tab === "dms" && searchQuery.length >= 2 && (
              <div className="border-b border-gray-200 dark:border-gray-700/60">
                <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Search results
                </p>
                {searching ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="size-5 animate-spin text-gray-400" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-gray-400">No users found</p>
                ) : (
                  searchResults.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => openDM(u)}
                      className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Avatar user={u} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="truncate text-xs text-gray-400">@{u.username}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* DM Conversations */}
            {tab === "dms" && !searchQuery && (
              <>
                {loadingList ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-gray-400" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                    <MessageCircle className="size-10 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-400">No conversations yet.</p>
                    <p className="text-xs text-gray-400">Search for a user to start chatting!</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.partner._id}
                      onClick={() => openDM(conv.partner)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
                        active?.kind === "dm" && active.partner._id === conv.partner._id
                          ? "bg-emerald-50 dark:bg-emerald-950/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <div className="relative">
                        <Avatar user={conv.partner} size="sm" />
                        {conv.unread > 0 && (
                          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {conv.partner.firstName} {conv.partner.lastName}
                          </p>
                          <span className="shrink-0 text-[11px] text-gray-400">
                            {timeAgo(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="truncate text-xs text-gray-400">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </>
            )}

            {/* Communities */}
            {tab === "communities" && (
              <>
                {loadingList ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-gray-400" />
                  </div>
                ) : communities.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                    <Users className="size-10 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-400">No rooms yet.</p>
                    <p className="text-xs text-gray-400">Create one or join with an invite key!</p>
                  </div>
                ) : (
                  communities.map((community) => (
                    <button
                      key={community._id}
                      onClick={() => openCommunity(community)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
                        active?.kind === "community" &&
                          active.community._id === community._id
                          ? "bg-emerald-50 dark:bg-emerald-950/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm dark:bg-emerald-900/40">
                        <Hash className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {community.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {community.members.length} member{community.members.length !== 1 ? "s" : ""}
                          {" · "}
                          <span className="font-mono">{community.inviteKey}</span>
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </aside>

        {/* ── Message area ── */}
        <div className="flex flex-1 flex-col">
          {!active ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                <MessageCircle className="size-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Start a conversation
              </h3>
              <p className="max-w-xs text-sm text-gray-400">
                Select a chat from the sidebar, search for a user, or join a
                community room using an invite key.
              </p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-700/60">
                {active.kind === "dm" ? (
                  <>
                    <Avatar user={active.partner} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {active.partner.firstName} {active.partner.lastName}
                      </p>
                      <p className="text-xs text-gray-400">@{active.partner.username}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                      <Hash className="size-4 text-emerald-600" />
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {active.community.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activeCommunity?.members.length ?? "…"} members
                        {" · "}Key:{" "}
                        <span className="font-mono font-semibold tracking-widest text-emerald-600 dark:text-emerald-400">
                          {active.community.inviteKey}
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                    ⚠️ {error}
                  </div>
                )}

                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-gray-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <p className="text-4xl">💬</p>
                    <p className="text-sm text-gray-400">
                      No messages yet. Say hello!
                    </p>
                  </div>
                ) : active.kind === "dm" ? (
                  dmMessages.map((msg) => {
                    const isMe = msg.sender._id === (currentUser?.id ?? "")
                    return (
                      <div
                        key={msg._id}
                        className={cn(
                          "flex items-end gap-2",
                          isMe ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        {!isMe && <Avatar user={msg.sender} size="sm" />}
                        <div
                          className={cn(
                            "max-w-xs rounded-2xl px-4 py-2.5 text-sm shadow-sm lg:max-w-md",
                            isMe
                              ? "rounded-br-sm bg-emerald-600 text-white"
                              : "rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          )}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={cn(
                              "mt-1 text-[11px]",
                              isMe ? "text-emerald-200" : "text-gray-400"
                            )}
                          >
                            {timeAgo(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  communityMessages.map((msg) => {
                    const isMe = msg.sender._id === (currentUser?.id ?? "")
                    return (
                      <div
                        key={msg._id}
                        className={cn(
                          "flex items-end gap-2",
                          isMe ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        {!isMe && <Avatar user={msg.sender} size="sm" />}
                        <div
                          className={cn(
                            "max-w-xs rounded-2xl px-4 py-2.5 text-sm shadow-sm lg:max-w-md",
                            isMe
                              ? "rounded-br-sm bg-emerald-600 text-white"
                              : "rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          )}
                        >
                          {!isMe && (
                            <p className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {msg.sender.firstName}
                            </p>
                          )}
                          <p>{msg.content}</p>
                          <p
                            className={cn(
                              "mt-1 text-[11px]",
                              isMe ? "text-emerald-200" : "text-gray-400"
                            )}
                          >
                            {timeAgo(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="border-t border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    void sendMessage()
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      active.kind === "dm"
                        ? `Message ${active.partner.firstName}…`
                        : `Message #${active.community.name}…`
                    }
                    disabled={sending}
                    className="flex-1 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        void sendMessage()
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
                    size="icon"
                  >
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
