import { Link } from "react-router-dom"
import { Menu, Shield, ShieldOff, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/store/chat-store"
import { Avatar } from "./Avatar"

export function ChatHeader({
  onToggleSidebar,
  screenshotProtected,
  onToggleScreenshot,
  onCall,
  callDisabled,
}: {
  onToggleSidebar: () => void
  screenshotProtected: boolean
  onToggleScreenshot: () => void
  onCall?: () => void
  callDisabled?: boolean
}) {
  const partner = useChatStore((s) => s.partner)
  if (!partner) return null

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
        >
          <Menu className="size-4 text-gray-500" />
        </button>
        <Link
          to={`/user/${partner.username}`}
          className="flex items-center gap-3 min-w-0"
        >
          <Avatar user={partner} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900 dark:text-white">
              {partner.firstName} {partner.lastName}
            </p>
            <p className="truncate text-xs text-gray-400">@{partner.username}</p>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-1">
        {onCall && (
          <button
            onClick={onCall}
            disabled={callDisabled}
            className={cn(
              "rounded-lg p-2 transition-colors",
              callDisabled
                ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                : "text-gray-400 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/30"
            )}
            title="Start video call"
          >
            <Video className="size-4" />
          </button>
        )}
        <button
          onClick={onToggleScreenshot}
          className={cn(
            "rounded-lg p-2 transition-colors",
            screenshotProtected
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          )}
          title={screenshotProtected ? "Screenshot protection on" : "Screenshot protection off"}
        >
          {screenshotProtected ? <Shield className="size-4" /> : <ShieldOff className="size-4" />}
        </button>
      </div>
    </div>
  )
}
