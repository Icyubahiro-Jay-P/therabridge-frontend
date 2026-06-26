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
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <NotificationsHeader unreadCount={unreadCount} totalCount={notifications.length} onMarkAllRead={markAllAsRead} onDeleteAll={deleteAll} />
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">{success}</div>}
      {error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"><TriangleAlert className="size-4 shrink-0" /> {error}</div>}
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
