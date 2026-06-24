import { useEffect, useRef, useState } from "react"
import {
  Clock,
  Hash,
  KeyRound,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  TriangleAlert,
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

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return "Something went wrong"
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString()
}

function Avatar({ user, size = "md" }: { user: ChatUser; size?: "sm" | "md" }) {
  const [imgError, setImgError] = useState(false)
  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `http://localhost:5000${user.avatar}`
    : null

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={`${user.firstName} ${user.lastName}`}
        onError={() => setImgError(true)}
        className={cn(
          "shrink-0 rounded-full object-cover",
          size === "sm" ? "size-8" : "size-10"
        )}
      />
    )
  }

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
            <TriangleAlert className="inline size-4 shrink-0" /> {error}
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
              placeholder="A safe space to share..."
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
            <TriangleAlert className="inline size-4 shrink-0" /> {error}
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
// CommunityPage
// ──────────────────────────────────────────────────────────────────────────────

export function CommunityPage() {
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
  const [showTimestamps, setShowTimestamps] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load communities
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await api.get<Community[]>("/api/chat/communities")
        setCommunities(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  // Load messages + poll
  useEffect(() => {
    if (!active) {
      setMessages([])
      return
    }

    let mounted = true

    async function loadMessages() {
      setLoadingMessages(true)
      setMessages([])
      try {
        const { data } = await api.get<Community>(
          `/api/chat/communities/${active._id}`
        )
        if (mounted) {
          setMessages(data.messages)
        }
      } catch (err) {
        if (mounted) setError(getErrorMessage(err))
      } finally {
        if (mounted) setLoadingMessages(false)
      }
    }

    void loadMessages()

    const interval = setInterval(async () => {
      try {
        const { data } = await api.get<Community>(
          `/api/chat/communities/${active._id}`
        )
        if (mounted) {
          setMessages(data.messages)
        }
      } catch {
        // silent
      }
    }, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [active])

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

  return (
    <div className="flex h-full overflow-hidden">
      {showCreate && (
        <CreateCommunityModal
          onClose={() => setShowCreate(false)}
          onCreate={(c) => {
            setCommunities((prev) => [c, ...prev])
            setActive(c)
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
            setActive(c)
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700/60">
        <div className="flex gap-2 p-3">
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

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-gray-400" />
            </div>
          ) : communities.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Users className="size-10 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400">No rooms yet.</p>
              <p className="text-xs text-gray-400">
                Create one or join with an invite key!
              </p>
            </div>
          ) : (
            communities.map((community) => (
              <button
                key={community._id}
                onClick={() => setActive(community)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
                  active?._id === community._id
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
                    {community.members.length} member
                    {community.members.length !== 1 ? "s" : ""}
                    {" · "}
                    <span className="font-mono">{community.inviteKey}</span>
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ── Message area ── */}
      <div className="flex flex-1 flex-col">
        {!active ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <Users className="size-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select a community
            </h3>
            <p className="max-w-xs text-sm text-gray-400">
              Choose a room from the sidebar or create one to start chatting.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5 dark:border-gray-700/60">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                  <Hash className="size-4 text-emerald-600" />
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {active.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {active.members.length} members
                    {" · "}Key:{" "}
                    <span className="font-mono font-semibold tracking-widest text-emerald-600 dark:text-emerald-400">
                      {active.inviteKey}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTimestamps((v) => !v)}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  showTimestamps
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                )}
                title={showTimestamps ? "Hide timestamps" : "Show timestamps"}
              >
                <Clock className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 px-5 py-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                  <TriangleAlert className="inline size-4 shrink-0" /> {error}
                </div>
              )}

              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-gray-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <MessageCircle className="size-10 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-400">
                    No messages yet. Say hello!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender._id === (currentUser?.id ?? "")
                  return (
                    <div
                      key={msg._id}
                      className="flex items-end gap-2"
                    >
                      {!isMe && <Avatar user={msg.sender} size="sm" />}
                      <div
                        className={cn(
                          "max-w-xs rounded-2xl px-4 py-2.5 text-sm shadow-sm lg:max-w-md",
                          isMe
                            ? "rounded-br-sm bg-emerald-600 text-white ml-auto"
                            : "rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        )}
                      >
                        {!isMe && (
                          <p className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {msg.sender.firstName}
                          </p>
                        )}
                        <p>{msg.content}</p>
                        {showTimestamps && (
                          <p
                            className={cn(
                              "mt-1 text-[11px]",
                              isMe ? "text-emerald-200" : "text-gray-400"
                            )}
                          >
                            {timeAgo(msg.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
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
                  placeholder={`Message #${active.name}...`}
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
  )
}
