import { useCommunityStore } from "@/store/community-store"
import { MessageArea as SharedMessageArea } from "../shared/MessageArea"
import { MessageBubble } from "./MessageBubble"

export function MessageArea() {
  const error = useCommunityStore((s) => s.error)
  const loadingMessages = useCommunityStore((s) => s.loadingMessages)
  const messages = useCommunityStore((s) => s.messages)
  const loadOlderMessages = useCommunityStore((s) => s.loadOlderMessages)
  const loadingOlder = useCommunityStore((s) => s.loadingOlder)
  const hasOlderMessages = useCommunityStore((s) => s.hasOlderMessages)

  return (
    <SharedMessageArea
      error={error}
      loadingMessages={loadingMessages}
      messages={messages}
      onLoadOlder={loadOlderMessages}
      loadingOlder={loadingOlder}
      hasOlder={hasOlderMessages}
      renderMessage={(msg) => {
        const m = msg as import("./types").CommunityMessage
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
