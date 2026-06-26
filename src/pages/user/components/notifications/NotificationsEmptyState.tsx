import { BellOff } from "lucide-react"

export function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <BellOff className="size-12 text-gray-300 dark:text-gray-600" />
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">No notifications</p>
        <p className="text-xs text-gray-400">You're all caught up on everything.</p>
      </div>
    </div>
  )
}
