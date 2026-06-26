import { MessageArea as SharedMessageArea } from "../shared/MessageArea"
import { MessageBubble } from "./MessageBubble"
import type { DirectMessage } from "./types"

export function MessageArea({
  error,
  loadingMessages,
  messages,
  currentUserId,
  editingId,
  editingContent,
  setEditingContent,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onUnsend,
  onToggleTimestamp,
  selectedTimestampMessage,
  menuOpenId,
  setMenuOpenId,
  showHistoryFor,
  setShowHistoryFor,
  deleting,
  messagesEndRef,
}: {
  error: string | null
  loadingMessages: boolean
  messages: DirectMessage[]
  currentUserId: string | undefined
  editingId: string | null
  editingContent: string
  setEditingContent: (v: string) => void
  onStartEdit: (msg: DirectMessage) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onUnsend: (id: string) => void
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  menuOpenId: string | null
  setMenuOpenId: (id: string | null) => void
  showHistoryFor: string | null
  setShowHistoryFor: (id: string | null) => void
  deleting: string | null
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <SharedMessageArea
      error={error}
      loadingMessages={loadingMessages}
      messages={messages}
      renderMessage={(msg) => {
        const m = msg as DirectMessage
        const isMe = m.sender._id === (currentUserId ?? "")
        return (
          <MessageBubble
            key={m._id}
            msg={m}
            isMe={isMe}
            editingId={editingId}
            editingContent={editingContent}
            setEditingContent={setEditingContent}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onUnsend={onUnsend}
            onToggleTimestamp={onToggleTimestamp}
            selectedTimestampMessage={selectedTimestampMessage}
            menuOpenId={menuOpenId}
            setMenuOpenId={setMenuOpenId}
            showHistoryFor={showHistoryFor}
            setShowHistoryFor={setShowHistoryFor}
            deleting={deleting}
          />
        )
      }}
    />
  )
}
