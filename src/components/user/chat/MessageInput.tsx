import { MessageInput as SharedMessageInput } from "../shared/MessageInput"
import { LIMITS } from "@/lib/limits"
import type { ReplySnapshot } from "./types"

export function MessageInput({
  partnerName,
  sending,
  value,
  onChange,
  onSend,
  onSendVoice,
  enterToSend,
  editing = false,
  onCancelEdit,
  replyTo,
  onCancelReply,
}: {
  partnerName: string
  sending: boolean
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onSendVoice?: (blob: Blob, duration: number) => void
  enterToSend: boolean
  editing?: boolean
  onCancelEdit?: () => void
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
      placeholder={`Message ${partnerName}...`}
      enterToSend={enterToSend}
      editing={editing}
      onCancelEdit={onCancelEdit}
      maxLength={LIMITS.message.dm}
      replyTo={replyTo ? { senderUsername: replyTo.senderUsername, content: replyTo.content, type: replyTo.type } : null}
      onCancelReply={onCancelReply}
    />
  )
}
