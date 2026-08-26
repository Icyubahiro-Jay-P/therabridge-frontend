import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useChatStore } from "@/store/chat-store"
import { SearchSection } from "./SearchSection"
import { ConversationList } from "./ConversationList"
import { SuggestedUsers } from "./SuggestedUsers"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChatUser } from "./types"

export function Sidebar({
  onSelectUser,
  onSelectConv,
  onTherryClick,
}: {
  onSelectUser: (user: ChatUser) => void
  onSelectConv: (user: ChatUser) => void
  onTherryClick: () => void
}) {
  const mobileSidebarOpen = useChatStore((s) => s.mobileSidebarOpen)
  const searchQuery = useChatStore((s) => s.searchQuery)
  const setSearchQuery = useChatStore((s) => s.setSearchQuery)
  const searching = useChatStore((s) => s.searching)
  const searchResults = useChatStore((s) => s.searchResults)
  const loadingList = useChatStore((s) => s.loadingList)
  const conversations = useChatStore((s) => s.conversations)
  const partner = useChatStore((s) => s.partner)
  const showPreviews = useChatStore((s) => s.showPreviews)
  const isTherry = useChatStore((s) => s.isTherry)
  const suggestions = useChatStore((s) => s.suggestions)
  const loadingSuggestions = useChatStore((s) => s.loadingSuggestions)

  return (
    <aside
      className={cn(
        "flex w-72 shrink-0 flex-col border-r border-gray-200 dark:border-gray-700/60",
        "md:relative md:flex",
        mobileSidebarOpen
          ? "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 pb-20"
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
          <>
            <ConversationList
              loadingList={loadingList}
              conversations={conversations}
              partner={partner}
              onSelectConv={onSelectConv}
              showPreviews={showPreviews}
              isTherry={isTherry}
              onTherryClick={onTherryClick}
            />
            <div className="mt-2 border-t border-gray-200 pt-3 pb-4 dark:border-gray-700/60">
              <SuggestedUsers
                loading={loadingSuggestions}
                suggestions={suggestions}
                onSelectUser={onSelectUser}
              />
            </div>
          </>
        )}
      </ScrollArea>
      <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2 md:hidden dark:border-gray-700/60">
        <span className="text-xs font-medium text-gray-400">Chats</span>
        <button
          onClick={() => useChatStore.setState({ mobileSidebarOpen: false })}
          className="flex size-7 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="size-4 text-gray-500" />
        </button>
      </div>
    </aside>
  )
}
