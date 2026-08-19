import { MessageInput as SharedMessageInput } from "../shared/MessageInput"
import { LIMITS } from "@/lib/limits"
import type { ReplySnapshot } from "../chat/types"

export function MessageInput({
  value,
  onChange,
  onSend,
  onSendVoice,
  sending,
  communityName,
  disabled = false,
  replyTo,
  onCancelReply,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onSendVoice?: (blob: Blob, duration: number) => void
  sending: boolean
  communityName: string
  disabled?: boolean
  replyTo?: ReplySnapshot | null
  onCancelReply?: () => void
}) {
  return (
    <SharedMessageInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      onSendVoice={onSendVoice}
      sending={sending}
      placeholder={disabled ? "Messaging is disabled" : `Message #${communityName}...`}
      enterToSend={true}
      disabled={disabled}
      maxLength={LIMITS.message.community}
      replyTo={replyTo ? { senderUsername: replyTo.senderUsername, content: replyTo.content, type: replyTo.type } : null}
      onCancelReply={onCancelReply}
    />
  )
}
