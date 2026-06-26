import { MessageArea as SharedMessageArea } from "../shared/MessageArea"
import { MessageBubble } from "./MessageBubble"
import type { CommunityMessage } from "./types"

export function MessageArea({
  error,
  loadingMessages,
  messages,
  currentUserId,
  onToggleTimestamp,
  selectedTimestampMessage,
}: {
  error: string | null
  loadingMessages: boolean
  messages: CommunityMessage[]
  currentUserId: string | undefined
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
}) {
  return (
    <SharedMessageArea
      error={error}
      loadingMessages={loadingMessages}
      messages={messages}
      renderMessage={(msg) => {
        const m = msg as CommunityMessage
        return (
          <MessageBubble
            key={m._id}
            msg={m}
            isMe={m.sender._id === (currentUserId ?? "")}
            onToggleTimestamp={onToggleTimestamp}
            selectedTimestampMessage={selectedTimestampMessage}
          />
        )
      }}
    />
  )
}
