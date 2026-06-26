import { useEffect, useState } from "react"
import { Loader2, TriangleAlert } from "lucide-react"

import { api } from "@/lib/api"
import { NotificationItem } from "./components/notifications/NotificationItem"
import { NotificationsHeader } from "./components/notifications/NotificationsHeader"
import { NotificationsEmptyState } from "./components/notifications/NotificationsEmptyState"

interface NotificationItemData { _id: string; type: string; title: string; body: string; read: boolean; createdAt: string }

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<NotificationItemData[]>("/api/notifications")
        setNotifications(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load")
      } finally { setLoading(false) }
    }
    void load()
  }, [])

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(null), 4000)
    return () => clearTimeout(timer)
  }, [success])

  async function markAsRead(id: string) {
    try {
      await api.put(`/api/notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n))
    } catch {}
  }

  async function markAllAsRead() {
    try {
      await api.put("/api/notifications/read-all")
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setSuccess("All marked as read")
    } catch {}
  }

  async function deleteNotification(id: string) {
    setDeletingId(id)
    try {
      await api.delete(`/api/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      setSuccess("Notification deleted")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    } finally { setDeletingId(null) }
  }

  async function deleteAll() {
    try {
      await api.delete("/api/notifications")
      setNotifications([])
      setSuccess("All notifications deleted")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
    setConfirmDeleteAll(false)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

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
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
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
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-gray-400" /></div>
      ) : notifications.length === 0 ? (
        <NotificationsEmptyState />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => <NotificationItem key={n._id} notification={n} deletingId={deletingId} onMarkRead={markAsRead} onDelete={deleteNotification} />)}
        </div>
      )}
    </div>
  )
}
