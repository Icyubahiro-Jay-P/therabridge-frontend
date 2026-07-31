import { Users } from "lucide-react"
import { EmptyState as SharedEmptyState } from "../shared/EmptyState"

export function EmptyState() {
  return (
    <SharedEmptyState
      icon={Users}
      title="Select a community"
      description="Choose a room from the sidebar or join one with an invite key."
    />
  )
}
