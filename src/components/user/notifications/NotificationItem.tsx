import { useNavigate } from "react-router-dom"
import {
  Bell, MessageCircle, Heart, AlertTriangle, TrendingUp, Shield, Loader2, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { timeAgo } from "./timeAgo"

const typeIcons: Record<string, typeof Bell> = {
  message: MessageCircle,
  community_invite: Bell,
  exercise_reminder: Heart,
  system: Shield,
  mood_reminder: Heart,
  crisis_alert: AlertTriangle,
  community_update: Bell,
  streak_milestone: TrendingUp,
  mood_checkin: Heart,
}

const typeColors: Record<string, string> = {
  message: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
  community_invite: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  exercise_reminder: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  system: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  mood_reminder: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  crisis_alert: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
  community_update: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
  streak_milestone: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  mood_checkin: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

interface NotificationData {
  _id: string
  type: string
  title: string
  body: string
  read: boolean
  createdAt: string
  data?: { url?: string }
}

export function NotificationItem({
  notification,
  deletingId,
  onMarkRead,
  onDelete,
}: {
  notification: NotificationData
  deletingId: string | null
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const navigate = useNavigate()
  const Icon = typeIcons[notification.type] || Bell
  const colorClass = typeColors[notification.type] || "bg-gray-100 text-gray-600 dark:bg-gray-800"

  return (
    <div
      onClick={() => {
        if (!notification.read) onMarkRead(notification._id)
        const url = notification.data?.url
        if (url) navigate(url)
      }}
      className={cn(
        "group flex items-start gap-4 rounded-2xl border p-4 transition-colors cursor-pointer",
        notification.read
          ? "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
          : "border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20"
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", colorClass)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm", notification.read ? "text-gray-900 dark:text-white" : "font-semibold text-gray-900 dark:text-white")}>
            {notification.title}
          </p>
          <span className="shrink-0 text-[11px] text-gray-400">{timeAgo(notification.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{notification.body}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); void onDelete(notification._id) }}
        disabled={deletingId === notification._id}
        className="shrink-0 rounded-lg p-1.5 text-gray-300 transition-opacity hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 hover-hover:opacity-0 hover-hover:group-hover:opacity-100"
      >
        {deletingId === notification._id ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
      </button>
    </div>
  )
}
