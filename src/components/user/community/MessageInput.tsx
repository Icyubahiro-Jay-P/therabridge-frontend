import { useCommunityStore } from "@/store/community-store"
import { MessageInput as SharedMessageInput } from "../shared/MessageInput"
import { LIMITS } from "@/lib/limits"

export function MessageInput({
  communityName,
  disabled = false,
}: {
  communityName: string
  disabled?: boolean
}) {
  const newMessage = useCommunityStore((s) => s.newMessage)
  const setNewMessage = useCommunityStore((s) => s.setNewMessage)
  const sending = useCommunityStore((s) => s.sending)
  const sendMessage = useCommunityStore((s) => s.sendMessage)
  const sendVoiceNote = useCommunityStore((s) => s.sendVoiceNote)
  const editingId = useCommunityStore((s) => s.editingId)
  const editingContent = useCommunityStore((s) => s.editingContent)
  const setEditingContent = useCommunityStore((s) => s.setEditingContent)
  const handleSaveEdit = useCommunityStore((s) => s.handleSaveEdit)
  const cancelEdit = useCommunityStore((s) => s.cancelEdit)
  const replyToMessage = useCommunityStore((s) => s.replyToMessage)
  const cancelReply = useCommunityStore((s) => s.cancelReply)

  return (
    <SharedMessageInput
      value={editingId ? editingContent : newMessage}
      onChange={editingId ? setEditingContent : setNewMessage}
      onSend={editingId ? handleSaveEdit : sendMessage}
      onSendVoice={!editingId ? (blob, dur) => sendVoiceNote(blob, dur) : undefined}
      sending={sending}
      placeholder={disabled ? "Messaging is disabled" : `Message #${communityName}...`}
      enterToSend={true}
      editing={!!editingId}
      onCancelEdit={cancelEdit}
      disabled={disabled}
      maxLength={LIMITS.message.community}
      replyTo={replyToMessage ? { senderUsername: replyToMessage.senderUsername, content: replyToMessage.content, type: replyToMessage.type } : null}
      onCancelReply={cancelReply}
    />
  )
}
