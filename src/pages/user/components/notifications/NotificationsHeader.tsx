import { CheckCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationsHeader({
  unreadCount,
  totalCount,
  onMarkAllRead,
  onDeleteAll,
}: {
  unreadCount: number
  totalCount: number
  onMarkAllRead: () => void
  onDeleteAll: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
        </p>
      </div>
      <div className="flex gap-2">
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllRead}>
            <CheckCheck className="size-3.5" /> Mark all read
          </Button>
        )}
        {totalCount > 0 && (
          <Button variant="outline" size="sm" onClick={onDeleteAll} className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30">
            <Trash2 className="size-3.5" /> Delete all
          </Button>
        )}
      </div>
    </div>
  )
}
