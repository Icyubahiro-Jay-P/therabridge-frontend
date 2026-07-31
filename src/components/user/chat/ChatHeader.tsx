import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { Avatar } from "./Avatar"
import type { ChatUser } from "./types"

export function ChatHeader({
  partner,
  onToggleSidebar,
}: {
  partner: ChatUser
  onToggleSidebar: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
        >
          <Menu className="size-4 text-gray-500" />
        </button>
        <Link
          to={`/user/${partner.username}`}
          className="flex items-center gap-3 min-w-0"
        >
          <Avatar user={partner} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900 dark:text-white">
              {partner.firstName} {partner.lastName}
            </p>
            <p className="truncate text-xs text-gray-400">@{partner.username}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
