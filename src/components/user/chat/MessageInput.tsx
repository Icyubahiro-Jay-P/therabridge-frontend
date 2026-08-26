import { useChatStore } from "@/store/chat-store"
import { MessageInput as SharedMessageInput } from "../shared/MessageInput"
import { LIMITS } from "@/lib/limits"

export function MessageInput({
  partnerName,
}: {
  partnerName: string
}) {
  const newMessage = useChatStore((s) => s.newMessage)
  const setNewMessage = useChatStore((s) => s.setNewMessage)
  const sending = useChatStore((s) => s.sending)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const sendVoiceNote = useChatStore((s) => s.sendVoiceNote)
  const enterToSend = useChatStore((s) => s.enterToSend)
  const editingId = useChatStore((s) => s.editingId)
  const editingContent = useChatStore((s) => s.editingContent)
  const setEditingContent = useChatStore((s) => s.setEditingContent)
  const handleSaveEdit = useChatStore((s) => s.handleSaveEdit)
  const cancelEdit = useChatStore((s) => s.cancelEdit)
  const replyToMessage = useChatStore((s) => s.replyToMessage)
  const cancelReply = useChatStore((s) => s.cancelReply)

  return (
    <SharedMessageInput
      value={editingId ? editingContent : newMessage}
      onChange={editingId ? setEditingContent : setNewMessage}
      onSend={editingId ? handleSaveEdit : sendMessage}
      onSendVoice={!editingId ? (blob, dur) => sendVoiceNote(blob, dur) : undefined}
      sending={sending}
      placeholder={`Message ${partnerName}...`}
      enterToSend={enterToSend}
      editing={!!editingId}
      onCancelEdit={cancelEdit}
      maxLength={LIMITS.message.dm}
      replyTo={replyToMessage ? { senderUsername: replyToMessage.senderUsername, content: replyToMessage.content, type: replyToMessage.type } : null}
      onCancelReply={cancelReply}
    />
  )
}
