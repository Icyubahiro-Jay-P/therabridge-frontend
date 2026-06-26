import { useCommunityState } from "./components/community/useCommunityState"
import { useCommunityEffects } from "./components/community/useCommunityEffects"
import { useMessagePolling } from "./components/community/useMessagePolling"
import { Sidebar } from "./components/community/Sidebar"
import { ChatHeader } from "./components/community/ChatHeader"
import { MessageArea } from "./components/community/MessageArea"
import { MessageInput } from "./components/community/MessageInput"
import { EmptyState } from "./components/community/EmptyState"
import { ScreenshotOverlay } from "./components/community/ScreenshotOverlay"
import { CreateCommunityModal } from "./components/community/CreateCommunityModal"
import { JoinCommunityModal } from "./components/community/JoinCommunityModal"
import { CommunitySettingsModal } from "./components/community/CommunitySettingsModal"

export function CommunityPage() {
  const c = useCommunityState()
  useCommunityEffects(c)
  useMessagePolling(c)

  return (
    <div className="flex h-full overflow-hidden select-none">
      <ScreenshotOverlay screenshotProtected={c.screenshotProtected} active={c.active} />
      {c.showCreate && (
        <CreateCommunityModal
          onClose={() => c.setShowCreate(false)}
          onCreate={(c2) => {
            c.setCommunities((prev) => [c2, ...prev])
            c.selectCommunity(c2)
          }}
        />
      )}
      {c.showJoin && (
        <JoinCommunityModal
          onClose={() => c.setShowJoin(false)}
          onJoin={(c2) => {
            c.setCommunities((prev) => prev.find((p) => p._id === c2._id) ? prev : [c2, ...prev])
            c.selectCommunity(c2)
          }}
        />
      )}
      {c.showSettings && c.active && c.currentUser && (
        <CommunitySettingsModal
          community={c.active}
          currentUserId={c.currentUser.id}
          onClose={() => c.setShowSettings(false)}
          onUpdate={(updated) => {
            c.setActive(updated)
            c.setCommunities((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
          }}
        />
      )}
      {c.mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => c.setMobileSidebarOpen(false)}
        />
      )}
      <Sidebar
        communities={c.communities}
        loading={c.loading}
        active={c.active}
        onSelectCommunity={c.selectCommunity}
        onCreateClick={() => c.setShowCreate(true)}
        onJoinClick={() => c.setShowJoin(true)}
        mobileSidebarOpen={c.mobileSidebarOpen}
        onCloseMobile={() => c.setMobileSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col">
        {!c.active ? (
          <EmptyState />
        ) : (
          <>
            <ChatHeader
              community={c.active}
              screenshotProtected={c.screenshotProtected}
              onToggleScreenshot={() => c.setScreenshotProtected((v) => !v)}
              onOpenSettings={() => c.setShowSettings(true)}
              onOpenMobile={() => c.setMobileSidebarOpen(true)}
            />
            <MessageArea
              error={c.error}
              loadingMessages={c.loadingMessages}
              messages={c.messages}
              currentUserId={c.currentUser?.id}
              onToggleTimestamp={c.toggleTimestamp}
              selectedTimestampMessage={c.selectedTimestampMessage}
            />
            <MessageInput
              value={c.newMessage}
              onChange={c.setNewMessage}
              onSend={c.sendMessage}
              sending={c.sending}
              communityName={c.active.name}
            />
          </>
        )}
      </div>
    </div>
  )
}
