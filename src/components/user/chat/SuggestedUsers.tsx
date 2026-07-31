import { Loader2, MessageCircle } from "lucide-react"
import { Avatar } from "./Avatar"
import type { ChatUser } from "./types"

export function SuggestedUsers({
  loading,
  suggestions,
  onSelectUser,
}: {
  loading: boolean
  suggestions: ChatUser[]
  onSelectUser: (user: ChatUser) => void
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="size-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col">
      <p className="px-3 pb-1 text-xs font-medium tracking-wider text-gray-400 uppercase">
        Suggested to talk to
      </p>
      <div className="flex w-full flex-col">
        {suggestions.map((u) => (
          <button
            key={u._id}
            onClick={() => onSelectUser(u)}
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="relative shrink-0">
              <Avatar user={u} size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {u.firstName} {u.lastName}
              </p>
              <p className="truncate text-xs text-gray-400">@{u.username}</p>
            </div>
            <MessageCircle className="size-4 shrink-0 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  )
}
