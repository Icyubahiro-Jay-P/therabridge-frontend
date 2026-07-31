import { ChatHeader } from "./ChatHeader"
import { MessageArea } from "./MessageArea"
import { MessageInput } from "./MessageInput"
import type { ChatUser, DirectMessage } from "./types"

export function ChatView({
  partner,
  onToggleSidebar,
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
  menuOpenId,
  setMenuOpenId,
  onToggleTimestamp,
  selectedTimestampMessage,
  showHistoryFor,
  setShowHistoryFor,
  deleting,
  newMessage,
  setNewMessage,
  sending,
  onSend,
  enterToSend,
}: {
  partner: ChatUser
  onToggleSidebar: () => void
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
  menuOpenId: string | null
  setMenuOpenId: (id: string | null) => void
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  showHistoryFor: string | null
  setShowHistoryFor: (id: string | null) => void
  deleting: string | null
  newMessage: string
  setNewMessage: (v: string) => void
  sending: boolean
  onSend: () => void
  enterToSend: boolean
}) {
  return (
    <>
      <ChatHeader partner={partner} onToggleSidebar={onToggleSidebar} />
      <MessageArea
        error={error}
        loadingMessages={loadingMessages}
        messages={messages}
        currentUserId={currentUserId}
        editingId={editingId}
        editingContent={editingContent}
        setEditingContent={setEditingContent}
        onStartEdit={onStartEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onUnsend={onUnsend}
        menuOpenId={menuOpenId}
        setMenuOpenId={setMenuOpenId}
        onToggleTimestamp={onToggleTimestamp}
        selectedTimestampMessage={selectedTimestampMessage}
        showHistoryFor={showHistoryFor}
        setShowHistoryFor={setShowHistoryFor}
        deleting={deleting}
      />
      <MessageInput
        partnerName={partner.firstName}
        sending={sending}
        value={newMessage}
        onChange={setNewMessage}
        onSend={onSend}
        enterToSend={enterToSend}
      />
    </>
  )
}
