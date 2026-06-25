import { useEffect, useRef, useState } from "react"
import {
  BotIcon,
  Loader2,
  Send,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "therry"
  content: string
  category?: string
  timestamp: string
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const suggestions = [
  "I'm feeling anxious about...",
  "I've been feeling sad lately",
  "I'm stressed about work/school",
  "I feel lonely and need someone to talk to",
  "Help me with a breathing exercise",
  "I'm feeling overwhelmed",
]

export function TherryPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "therry",
      content: "Hi, I'm Therry, your wellness companion. I'm here to listen, support, and guide you through whatever you're feeling. What's on your mind today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(content: string) {
    if (!content.trim()) return
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post<{ reply: string; category: string; isCrisis: boolean; timestamp: string }>("/api/therry/chat", { message: content.trim() })
      const therryMsg: ChatMessage = {
        id: `therry-${Date.now()}`,
        role: "therry",
        content: data.reply,
        category: data.category,
        timestamp: data.timestamp,
      }
      setMessages((prev) => [...prev, therryMsg])
      if (data.isCrisis) {
        setError("If you're in crisis, please reach out to emergency services immediately: 911 or 988.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-700/60">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600">
          <BotIcon className="size-5 text-white" />
        </span>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-white">Therry</h1>
          <p className="text-xs text-gray-400">Your AI wellness companion</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <TriangleAlert className="inline size-4 shrink-0" /> {error}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
              msg.role === "user"
                ? "bg-emerald-600 text-white rounded-br-md"
                : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
            )}>
              {msg.role === "therry" && (
                <p className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Therry
                </p>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              <p className={cn(
                "mt-1.5 text-[10px]",
                msg.role === "user" ? "text-emerald-200" : "text-gray-400"
              )}>
                {timeAgo(msg.timestamp)}
                {msg.category && msg.role === "therry" && (
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[9px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                    {msg.category}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-emerald-600" />
                <span className="text-sm text-gray-500">Therry is typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-6 pb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
        <form onSubmit={(e) => { e.preventDefault(); void handleSend(input) }} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            disabled={loading}
            className="flex-1 rounded-xl"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="shrink-0 bg-emerald-600 hover:bg-emerald-700" size="icon">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
