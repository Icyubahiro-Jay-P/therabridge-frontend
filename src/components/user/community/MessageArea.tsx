import { useCommunityStore } from "@/store/community-store"
import { useAuthStore } from "@/store/auth-store"
import { MessageArea as SharedMessageArea } from "../shared/MessageArea"
import { MessageBubble } from "./MessageBubble"

export function MessageArea() {
  const error = useCommunityStore((s) => s.error)
  const loadingMessages = useCommunityStore((s) => s.loadingMessages)
  const messages = useCommunityStore((s) => s.messages)
  const currentUserId = useAuthStore((s) => s.user?.id)
  const selectedTimestampMessage = useCommunityStore((s) => s.selectedTimestampMessage)

  return (
    <SharedMessageArea
      error={error}
      loadingMessages={loadingMessages}
      messages={messages}
      renderMessage={(msg) => {
        const m = msg as import("./types").CommunityMessage
        return (
          <MessageBubble
            key={m._id}
            msg={m}
            isMe={m.sender._id === (currentUserId ?? "")}
            selectedTimestampMessage={selectedTimestampMessage}
          />
        )
      }}
    />
  )
}
