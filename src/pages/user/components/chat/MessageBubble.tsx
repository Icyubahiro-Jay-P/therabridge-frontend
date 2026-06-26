import { CheckCheck, History, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DirectMessage } from "./types"
import { MessageActions } from "./MessageActions"
import { EditHistory } from "./EditHistory"
import { EditMessageForm } from "./EditMessageForm"
import { formatTime } from "./utils"

export function MessageBubble({
  msg,
  isMe,
  editingId,
  editingContent,
  setEditingContent,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onUnsend,
  onToggleTimestamp,
  selectedTimestampMessage,
  menuOpenId,
  setMenuOpenId,
  showHistoryFor,
  setShowHistoryFor,
  deleting,
}: {
  msg: DirectMessage
  isMe: boolean
  editingId: string | null
  editingContent: string
  setEditingContent: (v: string) => void
  onStartEdit: (msg: DirectMessage) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onUnsend: (id: string) => void
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  menuOpenId: string | null
  setMenuOpenId: (id: string | null) => void
  showHistoryFor: string | null
  setShowHistoryFor: (id: string | null) => void
  deleting: string | null
}) {
  const isUnsent = msg.unsent
  const isEditing = editingId === msg._id
  const canEdit = isMe && !isUnsent
  const menuOpen = menuOpenId === msg._id
  const msgAge = (Date.now() - new Date(msg.createdAt).getTime()) / 1000 / 60
  const editAllowed = canEdit && msgAge < 10 && (msg.editCount ?? 0) < 3
  const hasEdits = msg.edited && (msg.editHistory ?? []).length > 0
  const seen = isMe && msg.read && msg.readAt
  return (
    <div
      className={cn("mb-2 flex flex-col", isMe ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "flex max-w-[70%] gap-2",
          isMe ? "flex-row-reverse justify-end" : "flex-row"
        )}
      >
        {canEdit && (
          <button
            onClick={() => setMenuOpenId(menuOpen ? null : msg._id)}
            className="flex size-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <MoreVertical className="size-3.5" />
          </button>
        )}
        <div
          onClick={() => onToggleTimestamp(msg._id)}
          className={cn(
            "group wrap-break-words relative cursor-pointer rounded-2xl text-sm",
            isMe
              ? "rounded-br-md bg-emerald-600 text-white"
              : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          )}
          style={{ maxWidth: "100%" }}
        >
          {isEditing ? (
            <EditMessageForm
              content={editingContent}
              onChange={setEditingContent}
              onSave={onSaveEdit}
              onCancel={onCancelEdit}
            />
          ) : (
            <>
              <div
                className={cn("px-3.5 pt-2.5", isUnsent && "italic opacity-60")}
              >
                <p className="wrap-break-words whitespace-pre-wrap">
                  {isUnsent ? "Message unsent" : msg.content}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 px-3.5 pb-2",
                  isMe ? "justify-end" : "justify-start"
                )}
              />
            </>
          )}
        </div>
      </div>
      {menuOpen && canEdit && (
        <MessageActions
          isMe={isMe}
          editAllowed={editAllowed}
          onEdit={() => onStartEdit(msg)}
          onUnsend={() => {
            onUnsend(msg._id)
            setMenuOpenId(null)
          }}
          onClose={() => setMenuOpenId(null)}
          deleting={deleting === msg._id}
        />
      )}
      {selectedTimestampMessage === msg._id && !isUnsent && (
        <div className="mt-1 flex flex-row-reverse items-center gap-1 text-[10px]">
          {isMe && seen && (
            <span className="inline-flex items-center gap-0.5 text-[11px] leading-none text-emerald-400">
              <CheckCheck className="size-3" />
            </span>
          )}
          <span
            className={cn(
              "text-[11px] leading-none",
              isMe
                ? "text-emerald-300 dark:text-emerald-600"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {formatTime(msg.createdAt)}
          </span>
        </div>
      )}
      {hasEdits && (
        <button
          onClick={() =>
            setShowHistoryFor(showHistoryFor === msg._id ? null : msg._id)
          }
          className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-gray-400 hover:text-emerald-600 hover:underline dark:hover:text-emerald-400"
        >
          <History className="size-2.5" /> edited ({msg.editCount})
        </button>
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
}
