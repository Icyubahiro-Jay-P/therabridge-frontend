import { MessageInput as SharedMessageInput } from "../shared/MessageInput"
import { LIMITS } from "@/lib/limits"

export function MessageInput({
  value,
  onChange,
  onSend,
  sending,
  communityName,
  disabled = false,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  sending: boolean
  communityName: string
  disabled?: boolean
}) {
  return (
    <SharedMessageInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      sending={sending}
      placeholder={disabled ? "Messaging is disabled" : `Message #${communityName}...`}
      enterToSend={true}
      disabled={disabled}
      maxLength={LIMITS.message.community}
    />
  )
}
