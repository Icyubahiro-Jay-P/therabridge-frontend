import { useCommunityState } from "@/components/user/community/useCommunityState"
import { useCommunityEffects } from "@/components/user/community/useCommunityEffects"
import { useMessagePolling } from "@/components/user/community/useMessagePolling"
import { Sidebar } from "@/components/user/community/Sidebar"
import { ChatHeader } from "@/components/user/community/ChatHeader"
import { MessageArea } from "@/components/user/community/MessageArea"
import { MessageInput } from "@/components/user/community/MessageInput"
import { EmptyState } from "@/components/user/community/EmptyState"
import { ScreenshotOverlay } from "@/components/user/community/ScreenshotOverlay"
import { JoinCommunityModal } from "@/components/user/community/JoinCommunityModal"
import { CommunitySettingsModal } from "@/components/user/community/CommunitySettingsModal"

export function CommunityPage() {
  const c = useCommunityState()
  useCommunityEffects(c)
  useMessagePolling({ ...c, currentUserId: c.currentUser?.id })

  return (
    <div className="flex h-full overflow-hidden select-none">
      <ScreenshotOverlay screenshotProtected={c.screenshotProtected} active={c.active} />
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
