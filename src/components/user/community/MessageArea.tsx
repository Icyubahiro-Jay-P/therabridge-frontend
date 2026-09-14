import { useCommunityStore } from "@/store/community-store"
import { MessageArea as SharedMessageArea } from "../shared/MessageArea"
import { getGroupPosition } from "../shared/utils"
import { MessageBubble } from "./MessageBubble"
import type { CommunityMessage } from "./types"

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
      renderMessage={(msg, i) => {
        const m = msg as CommunityMessage
        const { isGroupStart, isGroupEnd } = getGroupPosition(
          messages as CommunityMessage[],
          i
        )
        return (
          <MessageBubble
            key={m._id}
            msg={m}
            isGroupStart={isGroupStart}
            isGroupEnd={isGroupEnd}
          />
        )
      }}
    />
  )
}
