import { useEffect, useRef } from "react"
import { Loader2, MessageCircle, TriangleAlert } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CommunityMessage } from "./types"
import { MessageBubble } from "./MessageBubble"

export function MessageArea({
  error,
  loadingMessages,
  messages,
  currentUserId,
  selectedTimestampMessage,
  onToggleTimestamp,
}: {
  error: string | null
  loadingMessages: boolean
  messages: CommunityMessage[]
  currentUserId: string | undefined
  selectedTimestampMessage: string | null
  onToggleTimestamp: (id: string) => void
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
          <p className="text-sm text-gray-400">
            No messages yet. Say hello!
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            msg={msg}
            isMe={msg.sender._id === (currentUserId ?? "")}
            selectedTimestampMessage={selectedTimestampMessage}
            onToggleTimestamp={onToggleTimestamp}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  )
}
