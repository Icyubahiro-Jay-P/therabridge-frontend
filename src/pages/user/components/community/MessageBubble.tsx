import { CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "./Avatar"
import type { CommunityMessage } from "./types"

export function MessageBubble({
  msg,
  isMe,
  selectedTimestampMessage,
  onToggleTimestamp,
}: {
  msg: CommunityMessage
  isMe: boolean
  selectedTimestampMessage: string | null
  onToggleTimestamp: (id: string) => void
}) {
  const readCount = msg.readBy?.length ?? 0

  return (
    <div className="flex items-end gap-2">
      {!isMe && <Avatar user={msg.sender} size="sm" />}
      <div
        onClick={() => onToggleTimestamp(msg._id)}
        className={cn(
          "max-w-xs cursor-pointer rounded-2xl text-sm shadow-sm lg:max-w-md",
          isMe
            ? "ml-auto rounded-br-sm bg-emerald-600 text-white"
            : "rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        )}
      >
        {!isMe && (
          <p className="px-4 pt-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {msg.sender.firstName}
          </p>
        )}
        <div className="px-4 pt-2.5">
          <p>{msg.content}</p>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 px-4 pb-2.5",
            isMe ? "justify-end" : "justify-start"
          )}
        >
          {isMe && readCount > 1 && (
            <span className="inline-flex items-center gap-0.5 text-[11px] leading-none text-emerald-200">
              <CheckCheck className="size-3" />
              {readCount - 1}
            </span>
          )}
        </div>
      </div>
      {selectedTimestampMessage === msg._id && (
        <div
          className={cn(
            "mt-1 text-[11px] leading-none",
            isMe
              ? "text-emerald-200"
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </div>
  )
}
