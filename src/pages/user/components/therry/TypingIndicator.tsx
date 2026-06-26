import { Loader2 } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin text-emerald-600" />
          <span className="text-sm text-gray-500">Therry is typing...</span>
        </div>
      </div>
    </div>
  )
}
