import { PhoneOff } from "lucide-react"
import { useChatStore } from "@/store/chat-store"
import { MessageArea as SharedMessageArea } from "../shared/MessageArea"
import { MessageBubble } from "./MessageBubble"

export function MessageArea() {
  const error = useChatStore((s) => s.error)
  const loadingMessages = useChatStore((s) => s.loadingMessages)
  const messages = useChatStore((s) => s.messages)
  const loadOlderMessages = useChatStore((s) => s.loadOlderMessages)
  const loadingOlder = useChatStore((s) => s.loadingOlder)
  const hasOlderMessages = useChatStore((s) => s.hasOlderMessages)

  return (
    <SharedMessageArea
      error={error}
      loadingMessages={loadingMessages}
      messages={messages}
      onLoadOlder={loadOlderMessages}
      loadingOlder={loadingOlder}
      hasOlder={hasOlderMessages}
      renderMessage={(msg) => {
        const m = msg as import("./types").DirectMessage
        if (m.kind === "screenshot-notice") {
          return (
            <div key={m._id} className="mb-2 flex items-center justify-center">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-500 dark:bg-gray-800/80 dark:text-gray-400">
                {m.content}
              </span>
            </div>
          )
        }
        if (m.kind === "missed-call") {
          return (
            <div key={m._id} className="mb-2 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11px] text-red-500 dark:bg-red-950/40 dark:text-red-400">
                <PhoneOff className="size-3" />
                Missed call
              </span>
            </div>
          )
        }
        return (
          <MessageBubble
            key={m._id}
            msg={m}
          />
        )
      }}
    />
  )
}
