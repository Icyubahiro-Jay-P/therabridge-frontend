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
  const replyToMessage = useCommunityStore((s) => s.replyToMessage)
  const cancelReply = useCommunityStore((s) => s.cancelReply)

  return (
    <SharedMessageInput
      value={newMessage}
      onChange={setNewMessage}
      onSend={sendMessage}
      onSendVoice={(blob, dur) => sendVoiceNote(blob, dur)}
      sending={sending}
      placeholder={disabled ? "Messaging is disabled" : `Message #${communityName}...`}
      enterToSend={true}
      disabled={disabled}
      maxLength={LIMITS.message.community}
      replyTo={replyToMessage ? { senderUsername: replyToMessage.senderUsername, content: replyToMessage.content, type: replyToMessage.type } : null}
      onCancelReply={cancelReply}
    />
  )
}
