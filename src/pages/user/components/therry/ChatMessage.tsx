import { cn } from "@/lib/utils"

interface ChatMessageData {
  id: string
  role: "user" | "therry"
  content: string
  category?: string
  timestamp: string
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function ChatMessage({ message }: { message: ChatMessageData }) {
  return (
    <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
        message.role === "user"
          ? "bg-emerald-600 text-white rounded-br-md"
          : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md"
      )}>
        {message.role === "therry" && (
          <p className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Therry
          </p>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        <p className={cn(
          "mt-1.5 text-[10px]",
          message.role === "user" ? "text-emerald-200" : "text-gray-400"
        )}>
          {timeAgo(message.timestamp)}
          {message.category && message.role === "therry" && (
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[9px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              {message.category}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
