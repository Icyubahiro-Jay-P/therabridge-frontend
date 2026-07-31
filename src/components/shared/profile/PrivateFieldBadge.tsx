import { Lock } from "lucide-react"

export function PrivateFieldBadge() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-500">
      <Lock className="size-3.5" />
      <span>Hidden</span>
    </div>
  )
}
