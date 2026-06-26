import { useChatState } from "./components/chat/useChatState"
import { useChatEffects } from "./components/chat/useChatEffects"
import { Sidebar } from "./components/chat/Sidebar"
import { EmptyState } from "./components/chat/EmptyState"
import { ChatView } from "./components/chat/ChatView"

export function ChatPage() {
  const c = useChatState()
  useChatEffects(c)

  return (
    <div className="flex h-full overflow-hidden">
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
      />
      <div className="flex flex-1 flex-col">
        {!c.partner ? (
          <EmptyState />
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
            onToggleTimestamp={c.toggleTimestamp}
            selectedTimestampMessage={c.selectedTimestampMessage}
            menuOpenId={c.menuOpenId}
            setMenuOpenId={c.setMenuOpenId}
            showHistoryFor={c.showHistoryFor}
            setShowHistoryFor={c.setShowHistoryFor}
            deleting={c.deleting}
            newMessage={c.newMessage}
            setNewMessage={c.setNewMessage}
            sending={c.sending}
            onSend={c.sendMessage}
            enterToSend={c.enterToSend}
            messagesEndRef={c.messagesEndRef}
          />
        )}
      </div>
    </div>
  )
}
