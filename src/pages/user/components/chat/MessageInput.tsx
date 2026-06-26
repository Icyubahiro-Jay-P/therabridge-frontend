import { MessageInput as SharedMessageInput } from "../shared/MessageInput"

export function MessageInput({
  partnerName,
  sending,
  value,
  onChange,
  onSend,
  enterToSend,
}: {
  partnerName: string
  sending: boolean
  value: string
  onChange: (v: string) => void
  onSend: () => void
  enterToSend: boolean
}) {
  return (
    <SharedMessageInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      sending={sending}
      placeholder={`Message ${partnerName}...`}
      enterToSend={enterToSend}
    />
  )
}
