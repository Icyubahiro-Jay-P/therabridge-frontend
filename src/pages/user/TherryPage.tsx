import { useEffect, useRef, useState } from "react"
import { TriangleAlert } from "lucide-react"

import { api } from "@/lib/api"
import { TherryHeader } from "./components/therry/TherryHeader"
import { ChatMessage } from "./components/therry/ChatMessage"
import { TypingIndicator } from "./components/therry/TypingIndicator"
import { SuggestionChips } from "./components/therry/SuggestionChips"
import { ChatInput } from "./components/therry/ChatInput"

interface ChatMessageData {
  id: string
  role: "user" | "therry"
  content: string
  category?: string
  timestamp: string
}

export function TherryPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
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
    const userMsg: ChatMessageData = {
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
      setMessages((prev) => [...prev, {
        id: `therry-${Date.now()}`,
        role: "therry",
        content: data.reply,
        category: data.category,
        timestamp: data.timestamp,
      }])
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
      <TherryHeader />

      <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <TriangleAlert className="inline size-4 shrink-0" /> {error}
          </div>
        )}

        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && <SuggestionChips onSelect={handleSend} />}

      <ChatInput value={input} loading={loading} onChange={setInput} onSubmit={(e) => { e.preventDefault(); void handleSend(input) }} />
    </div>
  )
}
