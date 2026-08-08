import { Avatar } from "./Avatar"
import { timeAgo } from "./utils"
import { cn } from "@/lib/utils"
import type { Conversation } from "./types"

const MAX_PREVIEW_CHARS = 20

function truncatePreview(text: string) {
  if (text.length <= MAX_PREVIEW_CHARS) return text
  return text.slice(0, MAX_PREVIEW_CHARS).trimEnd() + "..."
}

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
  const isMine = conv.lastMessage.sender._id !== conv.partner._id
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
      <div className="relative shrink-0">
        <Avatar user={conv.partner} size="sm" />
        {conv.unread > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
            {conv.unread}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {conv.partner.firstName} {conv.partner.lastName}
        </p>
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-xs text-gray-400">
            {showPreviews
              ? truncatePreview(`${isMine ? "You" : conv.partner.firstName}: ${conv.lastMessage.content}`)
              : "New message"}
          </p>
          <span className="shrink-0 text-[11px] text-gray-400">
            {timeAgo(conv.lastMessage.createdAt)}
          </span>
        </div>
      </div>
    </button>
  )
}
