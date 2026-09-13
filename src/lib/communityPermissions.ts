import type { User } from "@/types/user"
import type { Community } from "@/components/user/community/types"

// Mirrors the backend's canModerate helper (backend/controllers/chat.utils.js)
// - keep the two in sync.
export function canModerateCommunity(
  user: Pick<User, "id" | "role"> | null | undefined,
  community: Pick<Community, "owner" | "moderators"> | null | undefined,
): boolean {
  if (!user || !community) return false
  return (
    user.role === "admin" ||
    community.owner._id === user.id ||
    (community.moderators ?? []).some((m) => m._id === user.id)
  )
}
