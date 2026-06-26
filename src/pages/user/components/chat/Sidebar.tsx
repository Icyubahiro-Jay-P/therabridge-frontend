import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { SearchSection } from "./SearchSection"
import { ConversationList } from "./ConversationList"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChatUser, Conversation } from "./types"

export function Sidebar({
  mobileSidebarOpen,
  onCloseSidebar,
  searchQuery,
  setSearchQuery,
  searching,
  searchResults,
  onSelectUser,
  loadingList,
  conversations,
  partner,
  onSelectConv,
  showPreviews,
}: {
  mobileSidebarOpen: boolean
  onCloseSidebar: () => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  searching: boolean
  searchResults: ChatUser[]
  onSelectUser: (user: ChatUser) => void
  loadingList: boolean
  conversations: Conversation[]
  partner: ChatUser | null
  onSelectConv: (user: ChatUser) => void
  showPreviews: boolean
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
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searching={searching}
        searchResults={searchResults}
        onSelectUser={onSelectUser}
      />
      <ScrollArea className="flex-1">
        {!searchQuery && (
          <ConversationList
            loadingList={loadingList}
            conversations={conversations}
            partner={partner}
            onSelectConv={onSelectConv}
            showPreviews={showPreviews}
          />
        )}
      </ScrollArea>
      <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2 md:hidden dark:border-gray-700/60">
        <span className="text-xs font-medium text-gray-400">Chats</span>
        <button
          onClick={onCloseSidebar}
          className="flex size-7 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="size-4 text-gray-500" />
        </button>
      </div>
    </aside>
  )
}
