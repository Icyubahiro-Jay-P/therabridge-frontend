import { KeyRound, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Community } from "./types"
import { CommunityList } from "./CommunityList"

export function Sidebar({
  communities,
  loading,
  active,
  currentUserId,
  canCreate,
  onSelectCommunity,
  onJoinClick,
  onCreateClick,
  mobileSidebarOpen,
  onCloseMobile,
}: {
  communities: Community[]
  loading: boolean
  active: Community | null
  currentUserId?: string
  canCreate?: boolean
  onSelectCommunity: (c: Community) => void
  onJoinClick: () => void
  onCreateClick: () => void
  mobileSidebarOpen: boolean
  onCloseMobile: () => void
}) {
  return (
    <aside
      className={cn(
        "flex w-72 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700/60",
        "md:relative md:flex",
        mobileSidebarOpen
          ? "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900"
          : "hidden"
      )}
    >
      <div className="space-y-2 p-3">
        {canCreate && (
          <Button
            size="sm"
            onClick={onCreateClick}
            className="w-full bg-emerald-600 text-xs hover:bg-emerald-700"
          >
            <Plus className="size-3.5" /> Create community
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onJoinClick}
          className="w-full text-xs"
        >
          <KeyRound className="size-3.5" /> Join with invite key
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <CommunityList
          communities={communities}
          loading={loading}
          active={active}
          currentUserId={currentUserId}
          onSelect={onSelectCommunity}
        />
      </ScrollArea>
      <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2 md:hidden dark:border-gray-700/60">
        <span className="text-xs font-medium text-gray-400">Communities</span>
        <button
          onClick={onCloseMobile}
          className="flex size-7 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="size-4 text-gray-500" />
        </button>
      </div>
    </aside>
  )
}
