import { ChatHeader } from "./ChatHeader"
import { MessageArea } from "./MessageArea"
import { MessageInput } from "./MessageInput"
import type { ChatUser, DirectMessage, ReplySnapshot } from "./types"

export function ChatView({
  partner,
  onToggleSidebar,
  screenshotProtected,
  onToggleScreenshot,
  error,
  loadingMessages,
  messages,
  currentUserId,
  editingId,
  editingContent,
  setEditingContent,
  onStartEdit,
  onReply,
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
  onSendVoice,
  enterToSend,
  replyTo,
  onCancelReply,
  onLoadOlder,
  loadingOlder,
  hasOlder,
  callState,
  localStream,
  remoteStream,
  incomingCall,
  isMuted,
  isVideoOff,
  onStartCall,
  onAcceptCall,
  onRejectCall,
  onEndCall,
  onToggleMute,
  onToggleVideo,
}: {
  partner: ChatUser
  onToggleSidebar: () => void
  screenshotProtected: boolean
  onToggleScreenshot: () => void
  error: string | null
  loadingMessages: boolean
  messages: DirectMessage[]
  currentUserId: string | undefined
  editingId: string | null
  editingContent: string
  setEditingContent: (v: string) => void
  onStartEdit: (msg: DirectMessage) => void
  onReply: (msg: DirectMessage) => void
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
  onSendVoice: (blob: Blob, duration: number) => void
  enterToSend: boolean
  replyTo: ReplySnapshot | null
  onCancelReply: () => void
  onLoadOlder: () => void
  loadingOlder: boolean
  hasOlder: boolean
  callState?: string
  localStream?: MediaStream | null
  remoteStream?: MediaStream | null
  incomingCall?: {
    callId: string
    callerId: string
    callerName: string
    callerUsername: string
  } | null
  isMuted?: boolean
  isVideoOff?: boolean
  onStartCall?: () => void
  onAcceptCall?: () => void
  onRejectCall?: () => void
  onEndCall?: () => void
  onToggleMute?: () => void
  onToggleVideo?: () => void
}) {
  return (
    <>
      <ChatHeader
        partner={partner}
        onToggleSidebar={onToggleSidebar}
        screenshotProtected={screenshotProtected}
        onToggleScreenshot={onToggleScreenshot}
        onCall={onStartCall}
        callDisabled={callState !== "idle"}
      />
      <MessageArea
        error={error}
        loadingMessages={loadingMessages}
        messages={messages}
        currentUserId={currentUserId}
        editingId={editingId}
        onStartEdit={onStartEdit}
        onReply={onReply}
        onUnsend={onUnsend}
        menuOpenId={menuOpenId}
        setMenuOpenId={setMenuOpenId}
        onToggleTimestamp={onToggleTimestamp}
        selectedTimestampMessage={selectedTimestampMessage}
        showHistoryFor={showHistoryFor}
        setShowHistoryFor={setShowHistoryFor}
        deleting={deleting}
        onLoadOlder={onLoadOlder}
        loadingOlder={loadingOlder}
        hasOlder={hasOlder}
      />
      <MessageInput
        partnerName={partner.firstName}
        sending={sending}
        value={editingId ? editingContent : newMessage}
        onChange={editingId ? setEditingContent : setNewMessage}
        onSend={editingId ? onSaveEdit : onSend}
        onSendVoice={!editingId ? onSendVoice : undefined}
        enterToSend={enterToSend}
        editing={!!editingId}
        onCancelEdit={onCancelEdit}
        replyTo={!editingId ? replyTo : null}
        onCancelReply={onCancelReply}
      />
    </>
  )
}
