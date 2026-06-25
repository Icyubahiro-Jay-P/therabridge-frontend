import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CheckCheck,
  Loader2,
  MessageCircle,
  Search,
  Send,
  TriangleAlert,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

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
  readAt?: string
  createdAt: string
  unsent?: boolean
}

interface Conversation {
  partner: ChatUser
  lastMessage: DirectMessage
  unread: number
}

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

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function loadMessagePreviews(): boolean {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) {
      const s = JSON.parse(stored)
      return s.messagePreviews !== false
    }
  } catch {}
  return true
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

  const initials = (user.firstName[0] ?? "") + (user.lastName[0] ?? "")
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

export function ChatPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])
  const [searching, setSearching] = useState(false)

  const [partner, setPartner] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [selectedTimestampMessage, setSelectedTimestampMessage] = useState<
    string | null
  >(null)
  const [error, setError] = useState<string | null>(null)
  const [showPreviews, setShowPreviews] = useState(loadMessagePreviews)
  const [deleting, setDeleting] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onStorage() {
      setShowPreviews(loadMessagePreviews())
    }
    window.addEventListener("storage", onStorage)
    const interval = setInterval(
      () => setShowPreviews(loadMessagePreviews()),
      2000
    )
    return () => {
      window.removeEventListener("storage", onStorage)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    async function load() {
      setLoadingList(true)
      try {
        const { data } = await api.get<Conversation[]>(
          "/api/chat/conversations"
        )
        setConversations(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoadingList(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    if (!username) {
      setPartner(null)
      setMessages([])
      setError(null)
      return
    }
    let mounted = true

    async function resolveAndFetch() {
      setLoadingMessages(true)
      setMessages([])
      setError(null)
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
        const { data: msgData } = await api.get<DirectMessage[]>(
          `/api/chat/conversation/${user._id}`
        )
        if (mounted) setMessages(msgData)
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
    return () => {
      mounted = false
    }
  }, [username])

  useEffect(() => {
    if (!partner) return
    let mounted = true
    async function poll() {
      try {
        const c = partner!
        const { data } = await api.get<DirectMessage[]>(
          `/api/chat/conversation/${c._id}`
        )
        if (mounted) setMessages(data)
      } catch {}
    }
    const interval = setInterval(poll, 5000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [partner])

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

  useEffect(() => {
    function handleClick() {
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  async function sendMessage() {
    if (!newMessage.trim() || !partner) return
    setSending(true)
    try {
      const { data } = await api.post<DirectMessage>("/api/chat/send", {
        recipientId: partner._id,
        content: newMessage.trim(),
      })
      setMessages((prev) => [...prev, data])
      setNewMessage("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  async function handleUnsend(messageId: string) {
    setDeleting(messageId)
    try {
      await api.delete(`/api/chat/unsend/${messageId}`)
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, unsent: true, content: "[Message unsent]" }
            : m
        )
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeleting(null)
    }
  }

  function openDM(user: ChatUser) {
    navigate(`/chat/${user.username}`)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div
      className="flex h-full overflow-hidden"
    >
      <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700/60">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {searchQuery.length >= 2 && (
            <div className="border-b border-gray-200 dark:border-gray-700/60">
              <p className="px-3 py-1.5 text-xs font-medium tracking-wider text-gray-400 uppercase">
                Search results
              </p>
              {searching ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="size-5 animate-spin text-gray-400" />
                </div>
              ) : searchResults.length === 0 ? (
                <p className="px-3 py-3 text-sm text-gray-400">
                  No users found
                </p>
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
                      <p className="truncate text-xs text-gray-400">
                        @{u.username}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {!searchQuery && (
            <>
              {loadingList ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-5 animate-spin text-gray-400" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <MessageCircle className="size-10 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-400">No conversations yet.</p>
                  <p className="text-xs text-gray-400">
                    Search for a user to start chatting!
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.partner._id}
                    onClick={() => openDM(conv.partner)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors",
                      partner?._id === conv.partner._id
                        ? "bg-emerald-50 dark:bg-emerald-800/50"
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
                        {showPreviews
                          ? conv.lastMessage.content
                          : "New message"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </>
          )}
        </ScrollArea>
      </aside>

      <div className="flex flex-1 flex-col">
        {!partner ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <MessageCircle className="size-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select a conversation
            </h3>
            <p className="max-w-xs text-sm text-gray-400">
              Choose a chat from the sidebar or search for a user to start
              messaging.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5 dark:border-gray-700/60">
              <Link
                to={`/user/${partner.username}`}
                className="flex items-center gap-3"
              >
                <Avatar user={partner} size="sm" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {partner.firstName} {partner.lastName}
                  </p>
                  <p className="text-xs text-gray-400">@{partner.username}</p>
                </div>
              </Link>
            </div>

            <ScrollArea className="flex-1 px-5 py-4">
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
                  const seen = isMe && msg.read && msg.readAt
                  const isUnsent = msg.unsent
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex flex-col",
                        isMe ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        onClick={() =>
                          setSelectedTimestampMessage((prev) =>
                            prev === msg._id ? null : msg._id
                          )
                        }
                        className={cn(
                          "group relative max-w-[70%] rounded-2xl text-sm",
                          isMe
                            ? "rounded-br-md bg-emerald-600 text-white"
                            : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        )}
                      >
                        <div
                          className={cn(
                            "px-3.5 pt-2.5",
                            isUnsent && "italic opacity-60"
                          )}
                        >
                          <p>{isUnsent ? "Message unsent" : msg.content}</p>
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-2 px-3.5 pb-2",
                            isMe ? "justify-end" : "justify-start"
                          )}
                        >
                          {seen && !isUnsent && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] leading-none text-emerald-200">
                              <CheckCheck className="size-3" />
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedTimestampMessage === msg._id && (
                        <div
                          className={cn(
                            "mt-1 text-[11px] leading-none",
                            isMe ? "text-emerald-200" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {formatTime(msg.createdAt)}
                        </div>
                      )}
                      {isMe && !isUnsent && (
                        <button
                          onClick={() => handleUnsend(msg._id)}
                          disabled={deleting === msg._id}
                          className="mt-0.5 flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                        >
                          <X className="size-2.5" />
                          Unsend
                        </button>
                      )}
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

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
                  placeholder={`Message ${partner.firstName}...`}
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
