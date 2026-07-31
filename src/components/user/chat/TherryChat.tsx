import { useEffect, useRef, useState } from "react"
import { BotIcon, Loader2, Menu, TriangleAlert } from "lucide-react"

import { api } from "@/lib/api"
import { ChatMessage } from "../therry/ChatMessage"
import { TypingIndicator } from "../therry/TypingIndicator"
import { SuggestionChips } from "../therry/SuggestionChips"
import { ChatInput } from "../therry/ChatInput"

interface TherryMessageData {
  id: string
  role: "user" | "therry"
  content: string
  category?: string
  timestamp: string
}

const WELCOME_MESSAGE: TherryMessageData = {
  id: "welcome",
  role: "therry",
  content:
    "Hi, I'm Therry, your wellness companion. I'm here to listen, support, and guide you through whatever you're feeling. What's on your mind today?",
  timestamp: new Date().toISOString(),
}

export function TherryChat({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [messages, setMessages] = useState<TherryMessageData[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { data } = await api.get<
          { _id: string; role: "user" | "assistant"; content: string; category?: string; createdAt: string; edited?: boolean; editCount?: number }[]
        >("/api/therry/messages")
        if (!mounted) return
        setMessages(
          (data ?? []).map((m) => ({
            id: m._id,
            role: m.role === "user" ? "user" : "therry",
            content: m.content,
            category: m.category,
            timestamp: m.createdAt,
            edited: m.edited,
            editCount: m.editCount,
          }))
        )
      } catch {
        if (mounted) setError("Failed to load chat history.")
      } finally {
        if (mounted) setLoadingHistory(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending])

  async function handleSend(content: string) {
    if (!content.trim() || sending) return

    if (editingId) {
      await handleSaveEdit()
      return
    }

    const userMsg: TherryMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setSending(true)
    setError(null)
    try {
      const { data } = await api.post<{
        reply: string
        category: string
        isCrisis: boolean
        timestamp: string
      }>("/api/therry/chat", { message: content.trim() })
      setMessages((prev) => [
        ...prev,
        {
          id: `therry-${Date.now()}`,
          role: "therry",
          content: data.reply,
          category: data.category,
          timestamp: data.timestamp,
        },
      ])
      if (data.isCrisis) {
        setError(
          "If you're in crisis, please reach out to emergency services immediately: 911 or 988."
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response")
    } finally {
      setSending(false)
    }
  }

  const showWelcome = messages.length === 0 && !loadingHistory

  function startEdit(msg: TherryMessageData) {
    setEditingId(msg.id)
    setEditingContent(msg.content)
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingContent("")
  }

  async function handleSaveEdit() {
    if (!editingId || !editingContent.trim() || sending) return
    setSending(true)
    setError(null)
    try {
      const { data } = await api.put<
        { _id: string; content: string; edited?: boolean; editCount?: number }
      >(`/api/therry/messages/${editingId}`, { content: editingContent.trim() })
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? {
                ...m,
                content: data.content,
                edited: data.edited,
                editCount: data.editCount,
              }
            : m
        )
      )
      setEditingId(null)
      setEditingContent("")
      setInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to edit message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
          >
            <Menu className="size-4 text-gray-500" />
          </button>
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
            <BotIcon className="size-4 text-emerald-600" />
          </span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Therry</p>
            <p className="text-xs text-gray-400">
              Your AI wellness companion
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <span>
              <TriangleAlert className="inline size-4 shrink-0" /> {error}
            </span>
            <button
              onClick={() => setError(null)}
              className="ml-2 rounded bg-red-100 px-2 py-1 text-xs font-medium hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
            >
              Dismiss
            </button>
          </div>
        )}

        {loadingHistory ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {showWelcome && <ChatMessage message={WELCOME_MESSAGE} />}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isEditing={editingId === msg.id}
                onEdit={startEdit}
              />
            ))}
            {sending && <TypingIndicator />}
            <div ref={endRef} />
          </>
        )}
      </div>

      {showWelcome && !error && <SuggestionChips onSelect={handleSend} />}

      <ChatInput
        value={editingId ? editingContent : input}
        loading={sending || loadingHistory}
        onChange={editingId ? setEditingContent : setInput}
        editing={!!editingId}
        onCancelEdit={cancelEdit}
        onSubmit={(e) => {
          e.preventDefault()
          void handleSend(editingId ? editingContent : input)
        }}
      />
    </div>
  )
}
