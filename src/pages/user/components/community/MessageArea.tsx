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
  editingId,
  editingContent,
  setEditingContent,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onUnsend,
  menuOpenId,
  setMenuOpenId,
  showHistoryFor,
  setShowHistoryFor,
  deleting,
}: {
  error: string | null
  loadingMessages: boolean
  messages: CommunityMessage[]
  currentUserId: string | undefined
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  editingId: string | null
  editingContent: string
  setEditingContent: (v: string) => void
  onStartEdit: (msg: CommunityMessage) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onUnsend: (id: string) => void
  menuOpenId: string | null
  setMenuOpenId: (id: string | null) => void
  showHistoryFor: string | null
  setShowHistoryFor: (id: string | null) => void
  deleting: string | null
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
            editingId={editingId}
            editingContent={editingContent}
            setEditingContent={setEditingContent}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onUnsend={onUnsend}
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
