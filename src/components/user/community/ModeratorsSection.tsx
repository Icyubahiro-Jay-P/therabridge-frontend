import { useState } from "react"
import { Crown, Loader2, ShieldPlus, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "./Avatar"
import type { Community } from "./types"
import type { ChatUser } from "../chat/types"

export function ModeratorsSection({
  community,
  isOwner,
  busy,
  onToggle,
}: {
  community: Community
  isOwner: boolean
  busy: string | null
  onToggle: (userId: string, makeModerator: boolean) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const moderatorIds = new Set(community.moderators.map((m) => m._id))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Moderators ({community.moderators.length})
        </h3>
        {isOwner && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => setExpanded((v) => !v)}
          >
            <ShieldPlus className="size-3.5" /> Manage
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {community.moderators.map((mod) => (
          <div
            key={mod._id}
            className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <Avatar user={mod} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {mod.firstName} {mod.lastName}
                </p>
                <p className="text-xs text-gray-400">@{mod.username}</p>
              </div>
            </div>
            {isOwner && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onToggle(mod._id, false)}
                disabled={busy === mod._id}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <UserMinus className="size-3.5" /> Remove
              </Button>
            )}
          </div>
        ))}

        {expanded && isOwner && (
          <div>
            <h4 className="mb-2 mt-4 text-xs font-medium text-gray-400">
              Members to promote
            </h4>
            <div className="space-y-2">
              {community.members
                .filter((m: ChatUser) => !moderatorIds.has(m._id) && m._id !== community.owner._id)
                .map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar user={member} size="sm" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.firstName} {member.lastName}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onToggle(member._id, true)}
                      disabled={busy === member._id}
                      className="text-emerald-600"
                    >
                      {busy === member._id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <ShieldPlus className="size-3.5" />
                      )}
                      Promote
                    </Button>
                  </div>
                ))}
              {community.members.filter((m) => !moderatorIds.has(m._id) && m._id !== community.owner._id).length === 0 && (
                <p className="text-xs text-gray-400">No other members to promote.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {community.moderators.length === 0 && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Crown className="size-3.5" /> The owner runs this room alone for now.
        </p>
      )}
    </div>
  )
}
