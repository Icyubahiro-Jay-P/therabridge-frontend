import { useState } from "react"
import { CheckCheck, History, MoreVertical, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DirectMessage } from "./types"
import { MessageActions } from "./MessageActions"
import { EditHistory } from "./EditHistory"
import { EditMessageForm } from "./EditMessageForm"
import { formatTime, timeAgo } from "../shared/utils"

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
  menuOpenId,
  setMenuOpenId,
  onToggleTimestamp,
  selectedTimestampMessage,
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
  menuOpenId: string | null
  setMenuOpenId: (id: string | null) => void
  onToggleTimestamp: (id: string) => void
  selectedTimestampMessage: string | null
  showHistoryFor: string | null
  setShowHistoryFor: (id: string | null) => void
  deleting: string | null
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
      className={cn("mb-2 flex flex-col", isMe ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "group flex max-w-[70%] gap-1 items-center",
          isMe ? "flex-row-reverse justify-start" : "flex-row"
        )}
      >
        {canEdit && (
          <button
            onClick={() => setMenuOpenId(menuOpen ? null : msg._id)}
            className="flex cursor-pointer size-6 shrink-0 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20"
          >
            <MoreVertical className="size-3.5" />
          </button>
        )}
        <div
          onClick={() => onToggleTimestamp(msg._id)}
          className={cn(
            "wrap-break-words relative cursor-pointer rounded-2xl text-sm",
            isMe
              ? "rounded-br-md bg-emerald-600 text-white"
              : "rounded-bl-md bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
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
            setMenuOpenId(null)
            setConfirmUnsend(true)
          }}
          onClose={() => setMenuOpenId(null)}
          deleting={deleting === msg._id}
        />
      )}
      {confirmUnsend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmUnsend(false)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                <TriangleAlert className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Unsend message?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmUnsend(false)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button onClick={() => { onUnsend(msg._id); setConfirmUnsend(false) }} disabled={deleting === msg._id} className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                {deleting === msg._id ? "Unsending..." : "Unsend"}
              </button>
            </div>
          </div>
        </div>
      )}
      {!isUnsent && showTime && (
        <div className={cn("mt-0.5 flex items-center gap-1 text-[10px]", isMe ? "flex-row-reverse" : "flex-row")}>
          {isMe && seen && (
            <span className="inline-flex items-center gap-0.5 text-[11px] leading-none text-emerald-400">
              <CheckCheck className="size-3" />
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
      {hasEdits && (
        <button
          onClick={() =>
            setShowHistoryFor(showHistoryFor === msg._id ? null : msg._id)
          }
          className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[10px] dark:text-gray-400 text-gray-600 hover:text-emerald-600 hover:underline dark:hover:text-emerald-400"
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
