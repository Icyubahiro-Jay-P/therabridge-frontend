import { TriangleAlert, Users } from "lucide-react"
import { EmptyState as SharedEmptyState } from "../shared/EmptyState"

export function EmptyState({ error }: { error?: string | null }) {
  if (error) {
    return (
      <SharedEmptyState
        icon={TriangleAlert}
        title="Can't open this community"
        description={error}
      />
    )
  }
  return (
    <SharedEmptyState
      icon={Users}
      title="Select a community"
      description="Choose a room from the sidebar, create your own, or join one with an invite key."
    />
  )
}
