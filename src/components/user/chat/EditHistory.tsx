import { cn } from "@/lib/utils"
import type { EditEntry } from "./types"

export function EditHistory({
  history,
  isMe,
  formatTime,
}: {
  history: EditEntry[]
  isMe: boolean
  formatTime: (s: string) => string
}) {
  return (
    <div
      className={cn(
        "mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-900",
        isMe ? "mr-2" : "ml-2"
      )}
      style={{ maxWidth: "70%" }}
    >
      <p className="mb-1.5 font-medium text-gray-500 dark:text-gray-400">
        Edit history
      </p>
      <div className="space-y-1.5">
        {[...history].reverse().map((entry, i) => (
          <div key={i} className="rounded bg-white p-2 dark:bg-gray-800">
            <p className="text-gray-700 dark:text-gray-300">{entry.content}</p>
            <p className="mt-0.5 text-gray-400">{formatTime(entry.editedAt)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
