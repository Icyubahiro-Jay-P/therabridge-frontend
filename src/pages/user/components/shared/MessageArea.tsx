import { useEffect, useRef } from "react"
import { Loader2, MessageCircle, TriangleAlert } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ReactNode } from "react"

export function MessageArea({
  error,
  loadingMessages,
  messages,
  renderMessage,
  emptyMessage = "No messages yet. Say hello!",
  scrollToBottom = true,
}: {
  error: string | null
  loadingMessages: boolean
  messages: unknown[]
  renderMessage: (msg: unknown, index: number) => ReactNode
  emptyMessage?: string
  scrollToBottom?: boolean
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, scrollToBottom])

  return (
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
          <p className="text-sm text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        messages.map((msg, i) => renderMessage(msg, i))
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  )
}
