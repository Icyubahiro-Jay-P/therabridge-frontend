import { Link } from "react-router-dom"
import { CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CommunityMessage } from "./types"
import { Avatar } from "./Avatar"
import { timeAgo } from "../shared/utils"

export function MessageBubble({
  msg,
  isMe,
  onToggleTimestamp,
  selectedTimestampMessage,
}: {
  msg: CommunityMessage
  isMe: boolean
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
}) {
  const showTime = selectedTimestampMessage === msg._id
  const readCount = msg.readBy?.length ?? 0

  return (
    <div className={cn("mb-2 flex", isMe ? "justify-end" : "justify-start")}>
      {!isMe && (
        <Link to={`/user/${msg.sender.username}`} className="mr-2 mt-1 shrink-0">
          <Avatar user={msg.sender} size="sm" />
        </Link>
      )}
      <div className={cn("flex max-w-[70%] flex-col gap-0.5", isMe ? "items-end" : "items-start")}>
        {!isMe && (
          <span className="px-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {msg.sender.firstName}
          </span>
        )}
        <div
          onClick={() => onToggleTimestamp(msg._id)}
          className={cn(
            "wrap-break-words cursor-pointer rounded-2xl px-3.5 py-2 text-sm",
            isMe
              ? "rounded-br-md bg-emerald-600 text-white"
              : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          )}
        >
          <p className="wrap-break-words whitespace-pre-wrap">{msg.content}</p>
        </div>
        {showTime && (
          <div className={cn("flex items-center gap-1 text-[10px]", isMe ? "flex-row-reverse" : "flex-row")}>
            {isMe && readCount > 1 && (
              <span className="inline-flex items-center gap-0.5 text-[11px] leading-none text-emerald-400">
                <CheckCheck className="size-3" />
                {readCount - 1}
              </span>
            )}
            <span
              className={cn(
                "text-[11px] leading-none",
                isMe
                  ? "text-emerald-700 dark:text-emerald-600"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {timeAgo(msg.createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
