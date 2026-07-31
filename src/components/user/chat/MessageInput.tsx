import { MessageInput as SharedMessageInput } from "../shared/MessageInput"

export function MessageInput({
  partnerName,
  sending,
  value,
  onChange,
  onSend,
  enterToSend,
  editing = false,
  onCancelEdit,
}: {
  partnerName: string
  sending: boolean
  value: string
  onChange: (v: string) => void
  onSend: () => void
  enterToSend: boolean
  editing?: boolean
  onCancelEdit?: () => void
}) {
  return (
    <SharedMessageInput
      value={value}
      onChange={onChange}
      onSend={onSend}
      sending={sending}
      placeholder={`Message ${partnerName}...`}
      enterToSend={enterToSend}
      editing={editing}
      onCancelEdit={onCancelEdit}
    />
  )
}
