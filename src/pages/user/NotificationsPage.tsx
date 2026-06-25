import { useEffect, useState } from "react"
import {
  Bell,
  BellOff,
  CheckCheck,
  Loader2,
  Trash2,
  TriangleAlert,
  MessageCircle,
  Heart,
  AlertTriangle,
  TrendingUp,
  Shield,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface NotificationItem {
  _id: string
  type: string
  title: string
  body: string
  read: boolean
  createdAt: string
  sender?: { username: string; firstName: string; lastName: string } | null
  data?: Record<string, unknown>
}

const typeIcons: Record<string, typeof Bell> = {
  message: MessageCircle,
  community_invite: Bell,
  exercise_reminder: Heart,
  system: Shield,
  mood_reminder: Heart,
  crisis_alert: AlertTriangle,
  community_update: Bell,
  streak_milestone: TrendingUp,
}

const typeColors: Record<string, string> = {
  message: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
  community_invite: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  exercise_reminder: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  system: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
  mood_reminder: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
  crisis_alert: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
  community_update: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
  streak_milestone: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<NotificationItem[]>("/api/notifications")
        setNotifications(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load")
      } finally {
        setLoading(false)
      }
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
    } finally {
      setDeletingId(null)
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="size-3.5" /> Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={deleteAll} className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30">
              <Trash2 className="size-3.5" /> Delete all
            </Button>
          )}
        </div>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <BellOff className="size-12 text-gray-300 dark:text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">No notifications</p>
            <p className="text-xs text-gray-400">You're all caught up on everything.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell
            const colorClass = typeColors[n.type] || "bg-gray-100 text-gray-600 dark:bg-gray-800"
            return (
              <div
                key={n._id}
                onClick={() => !n.read && markAsRead(n._id)}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border p-4 transition-colors cursor-pointer",
                  n.read
                    ? "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                    : "border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20"
                )}
              >
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", colorClass)}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm", n.read ? "text-gray-900 dark:text-white" : "font-semibold text-gray-900 dark:text-white")}>
                      {n.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-gray-400">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{n.body}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); void deleteNotification(n._id) }}
                  disabled={deletingId === n._id}
                  className="shrink-0 rounded-lg p-1.5 text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  {deletingId === n._id ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
