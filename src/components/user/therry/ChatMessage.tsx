import { PencilLine } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageData {
  id: string
  role: "user" | "therry"
  content: string
  category?: string
  timestamp: string
  edited?: boolean
  editCount?: number
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function ChatMessage({
  message,
  isEditing,
  onEdit,
}: {
  message: ChatMessageData
  isEditing?: boolean
  onEdit?: (message: ChatMessageData) => void
}) {
  const isUser = message.role === "user"
  return (
    <div className={cn("group flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
        isUser
          ? "bg-emerald-600 text-white rounded-br-md"
          : "bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md",
        isEditing &&
          "ring-2 ring-amber-400 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950"
      )}>
        {message.role === "therry" && (
          <p className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Therry
          </p>
        )}
        <p className="wrap-break-words whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        <p className={cn(
          "mt-1.5 flex items-center gap-2 text-[10px]",
          message.role === "user" ? "text-emerald-200" : "text-gray-700"
        )}>
          <span>
            {timeAgo(message.timestamp)}
            {message.edited && " (edited)"}
          </span>
          {message.category && message.role === "therry" && (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              {message.category}
            </span>
          )}
        </p>
        {isUser && isEditing && (
          <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-amber-200">
            <PencilLine className="size-2.5" /> Editing...
          </p>
        )}
      </div>
      {isUser && onEdit && !isEditing && (
        <button
          onClick={() => onEdit(message)}
          className="ml-1.5 flex size-6 cursor-pointer shrink-0 items-center justify-center self-center rounded-full bg-black/10 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/20 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
          aria-label="Edit message"
        >
          <PencilLine className="size-3" />
        </button>
      )}
    </div>
  )
}
