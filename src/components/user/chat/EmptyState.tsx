import { MessageCircle } from "lucide-react"
import { EmptyState as SharedEmptyState } from "../shared/EmptyState"

export function EmptyState() {
  return (
    <SharedEmptyState
      icon={MessageCircle}
      title="Select a conversation"
      description="Choose a chat from the sidebar or search for a user to start messaging."
    />
  )
}
