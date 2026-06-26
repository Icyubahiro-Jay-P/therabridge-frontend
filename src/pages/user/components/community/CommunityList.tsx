import { Hash, Loader2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Community } from "./types"

export function CommunityList({
  communities,
  loading,
  active,
  onSelect,
}: {
  communities: Community[]
  loading: boolean
  active: Community | null
  onSelect: (c: Community) => void
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-gray-400" />
      </div>
    )
  }
  if (communities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <Users className="size-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-400">No rooms yet.</p>
        <p className="text-xs text-gray-400">
          Create one or join with an invite key!
        </p>
      </div>
    )
  }
  return (
    <>
      {communities.map((community) => (
        <button
          key={community._id}
          onClick={() => onSelect(community)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors",
            active?._id === community._id
              ? "bg-emerald-50 dark:bg-emerald-800/50"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm dark:bg-emerald-900/40">
            <Hash className="size-4 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {community.name}
            </p>
            <p className="text-xs text-gray-400">
              {community.members.length} member
              {community.members.length !== 1 ? "s" : ""} ·{" "}
              <span className="font-mono">{community.inviteKey}</span>
            </p>
          </div>
        </button>
      ))}
    </>
  )
}
