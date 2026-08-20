import { memo, useState } from "react"
import { Link } from "react-router-dom"
import {
  CheckCheck,
  History,
  MoreVertical,
  PencilLine,
  Reply,
  TriangleAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DirectMessage } from "./types"
import { Avatar } from "./Avatar"
import { MessageActions } from "./MessageActions"
import { EditHistory } from "./EditHistory"
import { VoiceMessagePlayer } from "../shared/VoiceMessagePlayer"
import { formatTime, timeAgo } from "../shared/utils"

export const MessageBubble = memo(function MessageBubble({
  msg,
  isMe,
  editingId,
  onStartEdit,
  onReply,
  onUnsend,
  menuOpenId,
  setMenuOpenId,
  onToggleTimestamp,
  selectedTimestampMessage,
  showHistoryFor,
  setShowHistoryFor,
  deleting,
  onScrollToMessage,
}: {
  msg: DirectMessage
  isMe: boolean
  editingId: string | null
  onStartEdit: (msg: DirectMessage) => void
  onReply: (msg: DirectMessage) => void
  onUnsend: (id: string) => void
  menuOpenId: string | null
  setMenuOpenId: (id: string | null) => void
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  showHistoryFor: string | null
  setShowHistoryFor: (id: string | null) => void
  deleting: string | null
  onScrollToMessage?: (id: string) => void
}) {
  const [confirmUnsend, setConfirmUnsend] = useState(false)
  const isUnsent = msg.unsent
  const isEditing = editingId === msg._id
  const canEdit = isMe && !isUnsent
  const menuOpen = menuOpenId === msg._id
  const msgAge = (Date.now() - new Date(msg.createdAt).getTime()) / 1000 / 60
  const editAllowed = canEdit && msgAge < 10 && (msg.editCount ?? 0) < 3
  const hasEdits = !isUnsent && msg.edited && (msg.editHistory ?? []).length > 0
  const showTime = selectedTimestampMessage === msg._id
  const seen = isMe && msg.read && msg.readAt
  return (
    <div
      id={`msg-${msg._id}`}
      className={cn(
        "relative mb-2 flex flex-col",
        isMe ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "group flex max-w-[70%] gap-1",
          isMe
            ? "flex-row-reverse items-center justify-start"
            : "flex-row items-start"
        )}
      >
        {!isMe && (
          <Link to={`/user/${msg.sender.username}`} className="mt-1 shrink-0">
            <Avatar user={msg.sender} size="sm" />
          </Link>
        )}
        <div className="flex min-w-0 flex-col">
          <div
            className={cn(
              "flex items-center gap-1",
              isMe ? "flex-row-reverse" : "flex-row"
            )}
          >
            {canEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpenId(menuOpen ? null : msg._id)
                }}
                className="hover-hover:opacity-0 hover-hover:group-hover:opacity-100 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/10 transition-opacity hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
              >
                <MoreVertical className="size-3.5" />
              </button>
            )}
            <div
              className={cn(
                "flex flex-col",
                isMe ? "items-end" : "items-start"
              )}
            >
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onReply(msg)
                  }}
                  className={cn(
                    "absolute top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white opacity-0 shadow-sm transition-opacity hover:bg-gray-100 group-hover/msg:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
                    isMe ? "-left-3" : "-right-3"
                  )}
                >
                  <Reply className="size-3 text-gray-500 dark:text-gray-400" />
                </button>
                <div
                  onClick={() => onToggleTimestamp(msg._id)}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    onReply(msg)
                  }}
                  className={cn(
                    "wrap-break-words relative min-w-0 cursor-pointer overflow-hidden rounded-2xl text-sm",
                    isMe
                      ? "rounded-br-md bg-emerald-600 text-white"
                      : "rounded-bl-md bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                    isEditing &&
                      (isMe
                        ? "ring-2 ring-teal-400 ring-offset-1 ring-offset-gray-50 dark:ring-offset-gray-950"
                        : "ring-2 ring-teal-400 ring-offset-1 ring-offset-gray-50 dark:ring-offset-gray-950")
                  )}
                >
                  {msg.replyTo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onScrollToMessage?.(msg.replyTo!._id)
                      }}
                      className={cn(
                        "mb-0.5 flex w-full items-start gap-2 border-l-2 px-2.5 py-1 text-left text-[11px] opacity-80 hover:opacity-100",
                        isMe
                          ? "border-white/50 bg-white/10"
                          : "border-emerald-400 bg-black/5 dark:border-emerald-500 dark:bg-white/5"
                      )}
                    >
                      <Reply className="mt-0.5 size-3 shrink-0" />
                      <span className="min-w-0 line-clamp-2">
                        <span className="font-semibold">{msg.replyTo.senderUsername}</span>
                        {" — "}
                        {msg.replyTo.type === "voice" ? "Voice message" : msg.replyTo.content}
                      </span>
                    </button>
                  )}
                  <div
                    className={cn(
                      "px-3.5 pt-2.5",
                      isUnsent && "italic opacity-60"
                    )}
                  >
                    {isUnsent ? (
                      <p className="wrap-break-words whitespace-pre-wrap italic">
                        Message unsent
                      </p>
                    ) : msg.type === "voice" && msg.audioUrl ? (
                      <VoiceMessagePlayer
                        audioUrl={msg.audioUrl}
                        duration={msg.duration}
                        isMe={isMe}
                      />
                    ) : (
                      <p className="wrap-break-words whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3.5 pb-2",
                      isMe ? "justify-end" : "justify-start"
                    )}
                  >
                    {isEditing && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-medium",
                          isMe
                            ? "text-teal-200"
                            : "text-teal-600 dark:text-teal-400"
                        )}
                      >
                        <PencilLine className="size-2.5" /> Editing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {(showTime || hasEdits) && (
                <div
                  className={cn(
                    "mt-1 flex flex-col gap-1 text-[10px]",
                    isMe ? "items-end" : "items-start"
                  )}
                >
                  {!isUnsent && showTime && (
                    <div className="flex items-center gap-1">
                      {isMe && seen && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] leading-none text-emerald-400">
                          <CheckCheck className="size-3" />
                        </span>
                      )}
                      <span
                        className={cn(
                          "pr-2 text-[11px] leading-none",
                          isMe
                            ? "text-emerald-700 dark:text-emerald-600"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      >
                        {timeAgo(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  {hasEdits && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowHistoryFor(
                          showHistoryFor === msg._id ? null : msg._id
                        )
                      }}
                      title="Show edit history"
                      className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-gray-500 transition-colors duration-150 hover:text-emerald-600 hover:underline dark:text-gray-400 dark:hover:text-emerald-400"
                    >
                      <History className="size-2.5" /> edited ({msg.editCount})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {menuOpen && canEdit && (
        <MessageActions
          isMe={isMe}
          editAllowed={editAllowed}
          onEdit={() => onStartEdit(msg)}
          onReply={() => {
            setMenuOpenId(null)
            onReply(msg)
          }}
          onUnsend={() => {
            setMenuOpenId(null)
            setConfirmUnsend(true)
          }}
          onClose={() => setMenuOpenId(null)}
          deleting={deleting === msg._id}
        />
      )}
      {confirmUnsend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setConfirmUnsend(false)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                <TriangleAlert className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Unsend message?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmUnsend(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUnsend(msg._id)
                  setConfirmUnsend(false)
                }}
                disabled={deleting === msg._id}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting === msg._id ? "Unsending..." : "Unsend"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showHistoryFor === msg._id && hasEdits && (
        <EditHistory
          history={msg.editHistory ?? []}
          isMe={isMe}
          formatTime={formatTime}
        />
      )}
    </div>
  )
})
