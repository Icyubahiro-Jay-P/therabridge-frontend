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
  const markReadMutation = useMarkNotificationRead()

  const notifications: NotificationItemData[] = data?.data ?? []
  const [optimisticNotifications, setOptimisticNotifications] = useState<NotificationItemData[] | null>(null)

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(null), 4000)
    return () => clearTimeout(timer)
  }, [success])

  const displayList = optimisticNotifications ?? notifications

  async function markAsRead(id: string) {
    setOptimisticNotifications((prev) => {
      const list = prev ?? notifications
      return list.map((n) => (n._id === id ? { ...n, read: true } : n))
    })
    try {
      await markReadMutation.mutateAsync(id)
      window.dispatchEvent(new Event("notifications-updated"))
    } catch {
      setOptimisticNotifications(null)
    }
  }

  async function markAllAsRead() {
    setOptimisticNotifications((prev) => {
      const list = prev ?? notifications
      return list.map((n) => ({ ...n, read: true }))
    })
    try {
      await api.put("/api/notifications/read-all")
      window.dispatchEvent(new Event("notifications-updated"))
      setSuccess("All marked as read")
    } catch {
      setOptimisticNotifications(null)
    }
  }

  async function deleteNotification(id: string) {
    setDeletingId(id)
    setOptimisticNotifications((prev) => {
      const list = prev ?? notifications
      return list.filter((n) => n._id !== id)
    })
    try {
      await api.delete(`/api/notifications/${id}`)
      window.dispatchEvent(new Event("notifications-updated"))
      setSuccess("Notification deleted")
    } catch {
      setOptimisticNotifications(null)
    } finally {
      setDeletingId(null)
    }
  }

  async function deleteAll() {
    try {
      await api.delete("/api/notifications")
      setOptimisticNotifications([])
      window.dispatchEvent(new Event("notifications-updated"))
      setSuccess("All notifications deleted")
    } catch {
      setOptimisticNotifications(null)
    }
    setConfirmDeleteAll(false)
  }

  const unreadCount = displayList.filter((n) => !n.read).length

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
        totalCount={displayList.length}
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
