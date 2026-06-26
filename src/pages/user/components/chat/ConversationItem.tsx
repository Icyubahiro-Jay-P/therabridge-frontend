import { Avatar } from "./Avatar"
import { timeAgo } from "./utils"
import { cn } from "@/lib/utils"
import type { Conversation } from "./types"

export function ConversationItem({
  conv,
  isActive,
  onClick,
  showPreviews,
}: {
  conv: Conversation
  isActive: boolean
  onClick: () => void
  showPreviews: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors",
        isActive
          ? "bg-emerald-50 dark:bg-emerald-800/50"
          : "hover:bg-gray-50 dark:hover:bg-gray-800"
      )}
    >
      <div className="relative">
        <Avatar user={conv.partner} size="sm" />
        {conv.unread > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
            {conv.unread}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {conv.partner.firstName} {conv.partner.lastName}
          </p>
          <span className="shrink-0 text-[11px] text-gray-400">
            {timeAgo(conv.lastMessage.createdAt)}
          </span>
        </div>
        <p className="truncate text-xs text-gray-400">
          {showPreviews ? conv.lastMessage.content : "New message"}
        </p>
      </div>
    </button>
  )
}
