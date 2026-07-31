import { Button } from "@/components/ui/button"
import { Avatar } from "./Avatar"
import type { Community } from "./types"

export function MemberList({
  community,
  isOwner,
  removing,
  onRemoveMember,
}: {
  community: Community
  isOwner: boolean
  removing: string | null
  onRemoveMember: (userId: string) => void
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        Members ({community.members.length})
      </h3>
      <div className="space-y-2">
        {community.members.map((member) => {
          const isMemberOwner = member._id === community.owner._id
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
                  </p>
                  <p className="text-xs text-gray-400">
                    @{member.username}
                  </p>
                </div>
              </div>
              {isOwner && !isMemberOwner && (
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
