import { Button } from "@/components/ui/button"
import { Avatar } from "./Avatar"
import type { Community } from "./types"

export function MemberList({
  community,
  canModerate,
  removing,
  onRemoveMember,
}: {
  community: Community
  canModerate: boolean
  removing: string | null
  onRemoveMember: (userId: string) => void
}) {
  const moderatorIds = new Set((community.moderators ?? []).map((m) => m._id))

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        Members ({community.members.length})
      </h3>
      <div className="space-y-2">
        {community.members.map((member) => {
          const isMemberOwner = member._id === community.owner._id
          const isModerator = moderatorIds.has(member._id)
          return (
            <div
              key={member._id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <Avatar user={member} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {member.firstName} {member.lastName}
                    {isMemberOwner && (
                      <span className="ml-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        (owner)
                      </span>
                    )}
                    {isModerator && (
                      <span className="ml-1.5 text-xs text-amber-600 dark:text-amber-400">
                        (moderator)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{member.username}
                  </p>
                </div>
              </div>
              {canModerate && !isMemberOwner && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onRemoveMember(member._id)}
                  disabled={removing === member._id}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                >
                  {removing === member._id ? "..." : "Remove"}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
