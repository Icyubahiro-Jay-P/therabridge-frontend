import { useState, useEffect } from "react"
import { TriangleAlert } from "lucide-react"

import {
  useGetNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/lib/query-hooks"
import { NotificationItem } from "@/components/user/notifications/NotificationItem"
import { NotificationsHeader } from "@/components/user/notifications/NotificationsHeader"
import { NotificationsEmptyState } from "@/components/user/notifications/NotificationsEmptyState"
import { Skeleton } from "@/components/ui/skeleton"

interface NotificationItemData {
  _id: string
  type: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-4">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function NotificationsPage() {
  const [success, setSuccess] = useState<string | null>(null)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useGetNotifications<NotificationItemData>(1, 100)
  const markRead = useMarkNotificationRead<NotificationItemData>()
  const markAllRead = useMarkAllNotificationsRead<NotificationItemData>()
  const deleteOne = useDeleteNotification<NotificationItemData>()
  const deleteEverything = useDeleteAllNotifications<NotificationItemData>()

  // Cache patches inside the hooks make this list react instantly; rollback
  // on failure is handled there too.
  const notifications: NotificationItemData[] = data?.data ?? []

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(null), 4000)
    return () => clearTimeout(timer)
  }, [success])

  async function markAsRead(id: string) {
    window.dispatchEvent(new Event("notifications-updated"))
    try {
      await markRead.mutateAsync(id)
    } catch {
      window.dispatchEvent(new Event("notifications-updated"))
    }
  }

  async function markAllAsRead() {
    window.dispatchEvent(new Event("notifications-updated"))
    try {
      await markAllRead.mutateAsync()
      setSuccess("All marked as read")
    } catch {
      window.dispatchEvent(new Event("notifications-updated"))
    }
  }

  async function deleteNotification(id: string) {
    setDeletingId(id)
    window.dispatchEvent(new Event("notifications-updated"))
    try {
      await deleteOne.mutateAsync(id)
      setSuccess("Notification deleted")
    } catch {
      window.dispatchEvent(new Event("notifications-updated"))
    } finally {
      setDeletingId(null)
    }
  }

  async function deleteAll() {
    try {
      await deleteEverything.mutateAsync()
      setSuccess("All notifications deleted")
    } catch {
      // List already restored by the hook.
    }
    setConfirmDeleteAll(false)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <NotificationsHeader unreadCount={0} totalCount={0} onMarkAllRead={() => {}} onDeleteAll={() => {}} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {error instanceof Error ? error.message : "Failed to load notifications"}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <NotificationsHeader
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllRead={markAllAsRead}
        onDeleteAll={() => setConfirmDeleteAll(true)}
      />
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {success}
        </div>
      )}
      {confirmDeleteAll && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
          <span className="text-sm text-red-700 dark:text-red-400">Delete all notifications?</span>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDeleteAll(false)} className="rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800">Cancel</button>
            <button onClick={deleteAll} className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">Delete</button>
          </div>
        </div>
      )}
      {displayList.length === 0 ? (
        <NotificationsEmptyState />
      ) : (
        <div className="space-y-2">
          {displayList.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              deletingId={deletingId}
              onMarkRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  )
}
