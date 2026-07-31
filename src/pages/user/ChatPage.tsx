import { Loader2, Menu } from "lucide-react"

import { useChatState } from "./components/chat/useChatState"
import { useChatEffects } from "./components/chat/useChatEffects"
import { Sidebar } from "./components/chat/Sidebar"
import { EmptyState } from "./components/chat/EmptyState"
import { ChatView } from "./components/chat/ChatView"
import { TherryChat } from "./components/chat/TherryChat"

export function ChatPage() {
  const c = useChatState()
  useChatEffects({ ...c, currentUserId: c.currentUser?.id })

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {c.mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => c.setMobileSidebarOpen(false)}
        />
      )}
      <Sidebar
        mobileSidebarOpen={c.mobileSidebarOpen}
        onCloseSidebar={() => c.setMobileSidebarOpen(false)}
        searchQuery={c.searchQuery}
        setSearchQuery={c.setSearchQuery}
        searching={c.searching}
        searchResults={c.searchResults}
        onSelectUser={c.openDM}
        loadingList={c.loadingList}
        conversations={c.conversations}
        partner={c.partner}
        onSelectConv={c.openDM}
        showPreviews={c.showPreviews}
        isTherry={c.isTherry}
        onTherryClick={() => c.navigate("/chat/therry")}
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        {c.isTherry ? (
          <TherryChat onToggleSidebar={() => c.setMobileSidebarOpen(true)} />
        ) : !c.partner ? (
          c.username ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="flex items-center border-b border-gray-200 px-4 py-3.5 md:hidden dark:border-gray-700/60">
                <button
                  onClick={() => c.setMobileSidebarOpen(true)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="size-4 text-gray-500" />
                </button>
                <span className="ml-2 text-sm font-medium text-gray-500">Chats</span>
              </div>
              <div className="grid min-h-0 flex-1 place-items-center">
                <EmptyState />
              </div>
            </>
          )
        ) : (
          <ChatView
            partner={c.partner}
            onToggleSidebar={() => c.setMobileSidebarOpen(true)}
            error={c.error}
            loadingMessages={c.loadingMessages}
            messages={c.messages}
            currentUserId={c.currentUser?.id}
            editingId={c.editingId}
            editingContent={c.editingContent}
            setEditingContent={c.setEditingContent}
            onStartEdit={c.startEdit}
            onSaveEdit={c.handleSaveEdit}
            onCancelEdit={c.cancelEdit}
            onUnsend={c.handleUnsend}
            menuOpenId={c.menuOpenId}
            setMenuOpenId={c.setMenuOpenId}
            onToggleTimestamp={c.toggleTimestamp}
            selectedTimestampMessage={c.selectedTimestampMessage}
            showHistoryFor={c.showHistoryFor}
            setShowHistoryFor={c.setShowHistoryFor}
            deleting={c.deleting}
            newMessage={c.newMessage}
            setNewMessage={c.setNewMessage}
            sending={c.sending}
            onSend={c.sendMessage}
            enterToSend={c.enterToSend}
          />
        )}
      </div>
    </div>
  )
}
