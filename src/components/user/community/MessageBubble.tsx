import { memo } from "react"
import { Link } from "react-router-dom"
import { CheckCheck, Reply } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CommunityMessage } from "./types"
import { Avatar } from "./Avatar"
import { VoiceMessagePlayer } from "../shared/VoiceMessagePlayer"
import { timeAgo } from "../shared/utils"

export const MessageBubble = memo(function MessageBubble({
  msg,
  isMe,
  onToggleTimestamp,
  selectedTimestampMessage,
  onReply,
  onScrollToMessage,
}: {
  msg: CommunityMessage
  isMe: boolean
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  onReply: (msg: CommunityMessage) => void
  onScrollToMessage?: (id: string) => void
}) {
  const showTime = selectedTimestampMessage === msg._id
  const readCount = msg.readBy?.length ?? 0
  const isUnsent = !!msg.unsent

  return (
    <div className={cn("group/msg mb-2 flex", isMe ? "justify-end" : "justify-start")}>
      {!isMe && (
        <Link
          to={`/user/${msg.sender.username}`}
          className="mt-1 mr-2 shrink-0"
        >
          <Avatar user={msg.sender} size="sm" />
        </Link>
      )}
      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-0.5",
          isMe ? "items-end" : "items-start"
        )}
      >
        {!isMe && (
          <span className="px-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {msg.sender.firstName}
          </span>
        )}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onReply(msg)
            }}
            className={cn(
              "absolute -top-2 z-10 flex size-6 items-center justify-center rounded-full border border-gray-200 bg-white opacity-0 shadow-sm transition-opacity hover:bg-gray-100 group-hover/msg:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
              isMe ? "-left-3" : "-right-3"
            )}
          >
            <Reply className="size-3 text-gray-500 dark:text-gray-400" />
          </button>
          <div
            onClick={() => onToggleTimestamp(msg._id)}
            className={cn(
              "wrap-break-words min-w-0 cursor-pointer overflow-hidden rounded-2xl px-3.5 py-2 text-sm",
              isMe
                ? "rounded-br-md bg-emerald-600 text-white"
                : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            )}
          >
            {msg.replyTo && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onScrollToMessage?.(msg.replyTo!._id)
                }}
                className={cn(
                  "mb-1.5 flex w-full items-center gap-2 border-l-2 px-2 py-1 text-left text-[11px] opacity-80 hover:opacity-100",
                  isMe
                    ? "border-white/50 bg-white/10"
                    : "border-emerald-400 bg-black/5 dark:border-emerald-500 dark:bg-white/5"
                )}
              >
                <Reply className="size-3 shrink-0" />
                <span className="truncate">
                  <span className="font-semibold">{msg.replyTo.senderUsername}</span>
                  {" — "}
                  {msg.replyTo.type === "voice" ? "🎤 Voice message" : msg.replyTo.content}
                </span>
              </button>
            )}
            {msg.type === "voice" && msg.audioUrl ? (
              <VoiceMessagePlayer
                audioUrl={msg.audioUrl}
                duration={msg.duration}
                isMe={isMe}
              />
            ) : (
              <p className="wrap-break-words whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>
        </div>
        {showTime && (
          <div
            className={cn(
              "flex items-center gap-1 text-[10px]",
              isMe ? "flex-row-reverse" : "flex-row"
            )}
          >
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
})
