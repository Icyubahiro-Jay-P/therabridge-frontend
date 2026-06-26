import { Hash, Menu, Settings, Shield, ShieldOff } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Community } from "./types"

export function ChatHeader({
  community,
  screenshotProtected,
  onToggleScreenshot,
  onOpenSettings,
  onOpenMobile,
}: {
  community: Community
  screenshotProtected: boolean
  onToggleScreenshot: () => void
  onOpenSettings: () => void
  onOpenMobile: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onOpenMobile}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
        >
          <Menu className="size-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
            <Hash className="size-4 text-emerald-600" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900 dark:text-white">
              {community.name}
            </p>
            <p className="text-xs text-gray-400">
              {community.members.length} members · Key:{" "}
              <span className="font-mono font-semibold tracking-widest text-emerald-600 dark:text-emerald-400">
                {community.inviteKey}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onOpenSettings}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          title="Community settings"
        >
          <Settings className="size-4" />
        </button>
        <div className="text-xs text-gray-400">
          Tap a message to show its time.
        </div>
        <button
          onClick={onToggleScreenshot}
          className={cn(
            "rounded-lg p-2 transition-colors",
            screenshotProtected
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          )}
        >
          {screenshotProtected ? (
            <Shield className="size-4" />
          ) : (
            <ShieldOff className="size-4" />
          )}
        </button>
      </div>
    </div>
  )
}
