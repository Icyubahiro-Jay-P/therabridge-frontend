import { Users } from "lucide-react"
import { EmptyState as SharedEmptyState } from "../shared/EmptyState"

export function EmptyState() {
  return (
    <SharedEmptyState
      icon={Users}
      title="Select a community"
      description="Choose a room from the sidebar or create one to start chatting."
    />
  )
}
