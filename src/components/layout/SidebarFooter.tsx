import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SidebarFooter({
  isMinimized, isHidden, username, onToggleSidebar, onLogoutClick,
}: {
  isMinimized: boolean
  isHidden: boolean
  username?: string
  onToggleSidebar: () => void
  onLogoutClick: () => void
}) {
  return (
    <div className={cn("border-t border-gray-200 dark:border-gray-800", isMinimized ? "p-1" : "p-3")}>
      {!isHidden && (
        <button
          onClick={onToggleSidebar}
          className={cn(
            "flex cursor-pointer items-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200",
            isMinimized ? "w-full justify-center" : "w-full gap-2"
          )}
          title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isMinimized ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!isMinimized && <span className="text-sm">Collapse</span>}
        </button>
      )}
      {!isMinimized && (
        <div className="mb-1 flex items-center justify-between gap-2 px-1">
          <span className="truncate text-sm text-gray-500 dark:text-gray-400">@{username}</span>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onLogoutClick}
        className={cn(
          "w-full cursor-pointer border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400",
          isMinimized ? "justify-center px-0" : "gap-1.5"
        )}
      >
        <LogOut className="size-3.5" />
        {!isMinimized && "Logout"}
      </Button>
    </div>
  )
}
