import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CheckCheck,
  Edit,
  History,
  Loader2,
  Menu,
  MessageCircle,
  MoreVertical,
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

interface EditEntry {
  content: string
  editedAt: string
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
  edited?: boolean
  editCount?: number
  editHistory?: EditEntry[]
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

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) {
      const s = JSON.parse(stored)
      return s[key] ?? fallback
    }
  } catch {}
  return fallback
}

function Avatar({ user, size = "md" }: { user: ChatUser; size?: "sm" | "md" }) {
  const [imgError, setImgError] = useState(false)
  const baseUrl: string =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_URL) ||
    "http://localhost:5000"
  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${baseUrl}${user.avatar}`
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
  const [error, setError] = useState<string | null>(null)
  const [showPreviews, setShowPreviews] = useState(() =>
    loadSetting("messagePreviews", true)
  )
  const [enterToSend, setEnterToSend] = useState(() =>
    loadSetting("enterToSend", true)
  )
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [selectedTimestampMessage, setSelectedTimestampMessage] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function reload() {
      setShowPreviews(loadSetting("messagePreviews", true))
      setEnterToSend(loadSetting("enterToSend", true))
    }
    window.addEventListener("storage", reload)
    const interval = setInterval(reload, 2000)
    return () => {
      window.removeEventListener("storage", reload)
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
    function handleClick() {}
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

  function startEdit(msg: DirectMessage) {
    setEditingId(msg._id)
    setEditingContent(msg.content)
    setMenuOpenId(null)
  }

  async function handleSaveEdit() {
    if (!editingId || !editingContent.trim()) return
    try {
      const { data } = await api.put<DirectMessage>(
        `/api/chat/edit/${editingId}`,
        { content: editingContent.trim() }
      )
      setMessages((prev) => prev.map((m) => (m._id === editingId ? data : m)))
      setEditingId(null)
      setEditingContent("")
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  function openDM(user: ChatUser) {
    navigate(`/chat/${user.username}`)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "flex w-72 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700/60",
          "md:relative md:flex",
          mobileSidebarOpen
            ? "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900"
            : "hidden"
        )}
      >
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

        {/* Mobile header with close */}
        <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2 md:hidden dark:border-gray-700/60">
          <span className="text-xs font-medium text-gray-400">Chats</span>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex size-7 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="size-4 text-gray-500" />
          </button>
        </div>
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
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
                >
                  <Menu className="size-4 text-gray-500" />
                </button>
                <Link
                  to={`/user/${partner.username}`}
                  className="flex items-center gap-3 min-w-0"
                >
                  <Avatar user={partner} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                      {partner.firstName} {partner.lastName}
                    </p>
                    <p className="truncate text-xs text-gray-400">@{partner.username}</p>
                  </div>
                </Link>
              </div>
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
                  const isEditing = editingId === msg._id
                  const canEdit = isMe && !isUnsent
                  const menuOpen = menuOpenId === msg._id
                  const windowMinutes = 10
                  const msgAge =
                    (Date.now() - new Date(msg.createdAt).getTime()) / 1000 / 60
                  const editAllowed =
                    canEdit &&
                    msgAge < windowMinutes &&
                    (msg.editCount ?? 0) < 3
                  const hasEdits =
                    msg.edited && (msg.editHistory ?? []).length > 0
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex flex-col mb-2",
                        isMe ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "flex max-w-[70%] gap-2",
                          isMe ? "flex-row-reverse justify-end" : "flex-row"
                        )}
                      >
                        {/* Three dots - always on the left side of the bubble */}
                        {canEdit && (
                          <div className="flex-shrink-0 pt-1">
                            <button
                              onClick={() =>
                                setMenuOpenId(menuOpen ? null : msg._id)
                              }
                              className="flex size-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10"
                            >
                              <MoreVertical className="size-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Message bubble - content sized with proper wrapping */}
                        <div
                          onClick={() =>
                            setSelectedTimestampMessage(
                              selectedTimestampMessage === msg._id
                                ? null
                                : msg._id
                            )
                          }
                          className={cn(
                            "cursor-pointer group relative rounded-2xl text-sm break-words",
                            isMe
                              ? "rounded-br-md bg-emerald-600 text-white"
                              : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          )}
                          style={{ maxWidth: "100%" }} // ensures it sizes to content but respects parent max-w
                        >
                          {isEditing && (
                            <div className="px-3.5 pt-2.5 pb-2">
                              <textarea
                                value={editingContent}
                                onChange={(e) =>
                                  setEditingContent(e.target.value)
                                }
                                className="w-full resize-none rounded-lg border border-emerald-400 bg-white/90 p-2 text-sm text-gray-900 outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100"
                                rows={2}
                                autoFocus
                              />
                              <div className="mt-2 flex justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingId(null)
                                    setEditingContent("")
                                  }}
                                  className="h-7 px-2 text-xs text-white hover:bg-white/20"
                                >
                                  <X className="size-3" /> Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleSaveEdit}
                                  disabled={!editingContent.trim()}
                                  className="h-7 bg-white px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                                >
                                  <CheckCheck className="size-3" /> Save
                                </Button>
                              </div>
                            </div>
                          )}

                          {!isEditing && (
                            <>
                              <div
                                className={cn(
                                  "px-3.5 pt-2.5",
                                  isUnsent && "italic opacity-60"
                                )}
                              >
                                <p className="break-words whitespace-pre-wrap">
                                  {isUnsent ? "Message unsent" : msg.content}
                                </p>
                              </div>

                              <div
                                className={cn(
                                  "flex items-center gap-2 px-3.5 pb-2",
                                  isMe ? "justify-end" : "justify-start"
                                )}
                              />
                            </>
                          )}
                        </div>
                      </div>

                      {/* Menu dropdown */}
                      {menuOpen && canEdit && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpenId(null)}
                          />
                          <div
                            className={cn(
                              "absolute z-20 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800",
                              isMe ? "right-8" : "left-8"
                            )}
                          >
                            {editAllowed && (
                              <button
                                onClick={() => startEdit(msg)}
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <Edit className="size-3" /> Edit
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleUnsend(msg._id)
                                setMenuOpenId(null)
                              }}
                              disabled={deleting === msg._id}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              <X className="size-3" /> Unsend
                            </button>
                          </div>
                        </>
                      )}

                      {/* Timestamp + seen (toggle on message click) */}
                      {selectedTimestampMessage === msg._id && !isUnsent && (
                        <div className="mt-1 flex items-center gap-1 text-[10px]">
                          {isMe && seen && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] leading-none text-emerald-400">
                              <CheckCheck className="size-3" />
                            </span>
                          )}
                          <span
                            className={cn(
                              "text-[11px] leading-none",
                              isMe
                                ? "text-emerald-300 dark:text-emerald-600"
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          >
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      )}

                      {/* Edit history stuff */}
                      {hasEdits && (
                        <button
                          onClick={() =>
                            setShowHistoryFor(
                              showHistoryFor === msg._id ? null : msg._id
                            )
                          }
                          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-gray-400 hover:text-emerald-600 hover:underline dark:hover:text-emerald-400 cursor-pointer"
                        >
                          <History className="size-2.5" />
                          edited ({msg.editCount})
                        </button>
                      )}

                      {showHistoryFor === msg._id && hasEdits && (
                        <div
                          className={cn(
                            "mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-900",
                            isMe ? "mr-2" : "ml-2"
                          )}
                          style={{ maxWidth: "70%" }}
                        >
                          <p className="mb-1.5 font-medium text-gray-500 dark:text-gray-400">
                            Edit history
                          </p>
                          <div className="space-y-1.5">
                            {[...(msg.editHistory ?? [])]
                              .reverse()
                              .map((entry, i) => (
                                <div
                                  key={i}
                                  className="rounded bg-white p-2 dark:bg-gray-800"
                                >
                                  <p className="text-gray-700 dark:text-gray-300">
                                    {entry.content}
                                  </p>
                                  <p className="mt-0.5 text-gray-400">
                                    {formatTime(entry.editedAt)}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
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
                    if (enterToSend && e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      void sendMessage()
                    }
                    if (
                      !enterToSend &&
                      e.key === "Enter" &&
                      (e.ctrlKey || e.metaKey)
                    ) {
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
