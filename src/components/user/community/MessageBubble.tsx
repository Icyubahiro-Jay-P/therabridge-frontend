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
import { Modal } from "@/components/ui/modal"
import { cn } from "@/lib/utils"
import { useCommunityStore } from "@/store/community-store"
import { useAuthStore } from "@/store/auth-store"
import { canModerateCommunity } from "@/lib/communityPermissions"
import type { CommunityMessage } from "./types"
import { Avatar } from "./Avatar"
import { MessageActions } from "../shared/MessageActions"
import { EditHistory } from "../shared/EditHistory"
import { VoiceMessagePlayer } from "../shared/VoiceMessagePlayer"
import { formatTime, timeAgo } from "../shared/utils"

export const MessageBubble = memo(function MessageBubble({
  msg,
  isGroupStart = true,
  isGroupEnd = true,
}: {
  msg: CommunityMessage
  isGroupStart?: boolean
  isGroupEnd?: boolean
}) {
  const currentUser = useAuthStore((s) => s.user)
  const active = useCommunityStore((s) => s.active)
  const editingId = useCommunityStore((s) => s.editingId)
  const startEdit = useCommunityStore((s) => s.startEdit)
  const startReply = useCommunityStore((s) => s.startReply)
  const handleUnsend = useCommunityStore((s) => s.handleUnsend)
  const menuOpenId = useCommunityStore((s) => s.menuOpenId)
  const setMenuOpenId = useCommunityStore((s) => s.setMenuOpenId)
  const toggleTimestamp = useCommunityStore((s) => s.toggleTimestamp)
  const selectedTimestampMessage = useCommunityStore((s) => s.selectedTimestampMessage)
  const showHistoryFor = useCommunityStore((s) => s.showHistoryFor)
  const setShowHistoryFor = useCommunityStore((s) => s.setShowHistoryFor)
  const deleting = useCommunityStore((s) => s.deleting)

  const isMe = msg.sender._id === (currentUser?.id ?? "")
  const [confirmUnsend, setConfirmUnsend] = useState(false)
  const isUnsent = !!msg.unsent
  const isEditing = editingId === msg._id
  // Moderators can unsend (but not edit) other members' messages, matching
  // the backend's authorization for this endpoint.
  const isModerator = canModerateCommunity(currentUser, active)
  const canEdit = isMe && !isUnsent
  const canUnsend = (isMe || isModerator) && !isUnsent
  const menuOpen = menuOpenId === msg._id
  const msgAge = (Date.now() - new Date(msg.createdAt).getTime()) / 1000 / 60
  const editAllowed = canEdit && msgAge < 10 && (msg.editCount ?? 0) < 3
  const hasEdits = !isUnsent && msg.edited && (msg.editHistory ?? []).length > 0
  const showTime = selectedTimestampMessage === msg._id
  const readCount = msg.readBy?.length ?? 0

  return (
    <div
      id={`msg-${msg._id}`}
      className={cn(
        "group/msg relative flex flex-col",
        isGroupEnd ? "mb-3" : "mb-0.5",
        isMe ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[70%] gap-1",
          isMe ? "flex-row-reverse items-center justify-start" : "flex-row items-end"
        )}
      >
        {!isMe &&
          (isGroupEnd ? (
            <Link to={`/user/${msg.sender.username}`} className="shrink-0">
              <Avatar user={msg.sender} size="sm" />
            </Link>
          ) : (
            <div className="size-8 shrink-0" />
          ))}
        <div className="flex min-w-0 flex-col">
          {!isMe && isGroupStart && (
            <span className="px-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {msg.sender.firstName}
            </span>
          )}
          <div
            className={cn(
              "flex items-center gap-1",
              isMe ? "flex-row-reverse" : "flex-row"
            )}
          >
            {canUnsend && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpenId(menuOpen ? null : msg._id)
                }}
                className="hover-hover:opacity-0 hover-hover:group-hover/msg:opacity-100 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/10 transition-opacity hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
              >
                <MoreVertical className="size-3.5" />
              </button>
            )}
            {!isUnsent && msg.replyTo && (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(`msg-${msg.replyTo!._id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className={cn(
                  "mb-0.5 w-fit max-w-full cursor-pointer truncate rounded-2xl px-3 py-1.5 text-left text-xs",
                  isMe
                    ? "bg-emerald-600/50 text-white/85 hover:bg-emerald-600/60"
                    : "bg-gray-200/70 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-400 dark:hover:bg-white/[0.09]"
                )}
              >
                <span className="font-semibold">{msg.replyTo.senderUsername}</span>
                <span className="opacity-75">
                  {" · "}
                  {msg.replyTo.type === "voice" ? "🎤 Voice message" : msg.replyTo.content}
                </span>
              </button>
            )}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  startReply(msg)
                }}
                className={cn(
                  "absolute top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white opacity-0 shadow-sm transition-opacity hover:bg-gray-100 group-hover/msg:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
                  isMe ? "-left-3" : "-right-3"
                )}
              >
                <Reply className="size-3 text-gray-500 dark:text-gray-400" />
              </button>
              <div
                onClick={() => toggleTimestamp(msg._id)}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  startReply(msg)
                }}
                className={cn(
                  "wrap-break-words min-w-0 cursor-pointer overflow-hidden rounded-[18px] text-[14.5px] leading-snug",
                  isMe
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                  isEditing &&
                    "ring-2 ring-teal-400 ring-offset-1 ring-offset-gray-50 dark:ring-offset-gray-950"
                )}
              >
                <div
                  className={cn(
                    "px-3.5 pt-2.5 pb-2",
                    isUnsent && "italic opacity-60"
                  )}
                >
                  {!isUnsent && msg.replyTo && (
                    <div
                      className={cn(
                        "mb-1.5 rounded-md border-l-2 px-2 py-1 text-xs opacity-80",
                        isMe
                          ? "border-white/50 bg-white/10"
                          : "border-emerald-500 bg-black/5 dark:bg-white/5"
                      )}
                    >
                      <p className="font-medium">{msg.replyTo.senderUsername}</p>
                      <p className="truncate">
                        {msg.replyTo.type === "voice" ? "🎤 Voice message" : msg.replyTo.content}
                      </p>
                    </div>
                  )}
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
                    <p className="wrap-break-words whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {isEditing && (
                    <span
                      className={cn(
                        "mt-1 flex items-center gap-1 text-[10px] font-medium",
                        isMe ? "text-teal-200" : "text-teal-600 dark:text-teal-400"
                      )}
                    >
                      <PencilLine className="size-2.5" /> Editing...
                    </span>
                  )}
                </div>
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
      {menuOpen && canUnsend && (
        <MessageActions
          isMe={isMe}
          editAllowed={editAllowed}
          onEdit={() => startEdit(msg)}
          onReply={() => {
            setMenuOpenId(null)
            startReply(msg)
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
        <Modal open onClose={() => setConfirmUnsend(false)} panelClassName="mx-4 max-w-sm">
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
                handleUnsend(msg._id)
                setConfirmUnsend(false)
              }}
              disabled={deleting === msg._id}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting === msg._id ? "Unsending..." : "Unsend"}
            </button>
          </div>
        </Modal>
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
