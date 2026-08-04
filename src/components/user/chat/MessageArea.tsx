import { MessageArea as SharedMessageArea } from "../shared/MessageArea"
import { MessageBubble } from "./MessageBubble"
import type { DirectMessage } from "./types"

export function MessageArea({
  error,
  loadingMessages,
  messages,
  currentUserId,
  editingId,
  onStartEdit,
  onUnsend,
  menuOpenId,
  setMenuOpenId,
  onToggleTimestamp,
  selectedTimestampMessage,
  showHistoryFor,
  setShowHistoryFor,
  deleting,
  onLoadOlder,
  loadingOlder,
  hasOlder,
}: {
  error: string | null
  loadingMessages: boolean
  messages: DirectMessage[]
  currentUserId: string | undefined
  editingId: string | null
  onStartEdit: (msg: DirectMessage) => void
  onUnsend: (id: string) => void
  menuOpenId: string | null
  setMenuOpenId: (id: string | null) => void
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  showHistoryFor: string | null
  setShowHistoryFor: (id: string | null) => void
  deleting: string | null
  onLoadOlder: () => void
  loadingOlder: boolean
  hasOlder: boolean
}) {
  return (
    <SharedMessageArea
      error={error}
      loadingMessages={loadingMessages}
      messages={messages}
      onLoadOlder={onLoadOlder}
      loadingOlder={loadingOlder}
      hasOlder={hasOlder}
      renderMessage={(msg) => {
        const m = msg as DirectMessage
        const isMe = m.sender._id === (currentUserId ?? "")
        return (
          <MessageBubble
            key={m._id}
            msg={m}
            isMe={isMe}
            editingId={editingId}
            onStartEdit={onStartEdit}
            onUnsend={onUnsend}
            menuOpenId={menuOpenId}
            setMenuOpenId={setMenuOpenId}
            onToggleTimestamp={onToggleTimestamp}
            selectedTimestampMessage={selectedTimestampMessage}
            showHistoryFor={showHistoryFor}
            setShowHistoryFor={setShowHistoryFor}
            deleting={deleting}
          />
        )
      }}
    />
  )
}
