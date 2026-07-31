import { MessageInput as SharedMessageInput } from "../shared/MessageInput"

export function MessageInput({
  value,
  onChange,
  onSend,
  sending,
  communityName,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  sending: boolean
  communityName: string
}) {
  return (
    <SharedMessageInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      sending={sending}
      placeholder={`Message #${communityName}...`}
      enterToSend={true}
    />
  )
}
