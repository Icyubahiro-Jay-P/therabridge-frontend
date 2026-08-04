import { ShieldOff } from "lucide-react"
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
import { CreateCommunityModal } from "@/components/user/community/CreateCommunityModal"
import { CommunitySettingsModal } from "@/components/user/community/CommunitySettingsModal"
import { GuardOverlay } from "@/components/privacy/GuardOverlay"
import { WatermarkCanvas } from "@/components/privacy/WatermarkCanvas"
import { useScreenshotGuard } from "@/hooks/useScreenshotGuard"
import { loadSetting } from "@/components/user/chat/utils"

export function CommunityPage() {
  const c = useCommunityState()
  useCommunityEffects(c)
  useMessagePolling({ ...c, currentUserId: c.currentUser?.id })

  const watermarkEnabled = loadSetting("watermarkEnabled", false)
  const guard = useScreenshotGuard({
    mode: "blackout",
    enabled: c.screenshotProtected,
    active: !!c.active,
  })
  const canCreate =
    c.currentUser?.role === "therapist" || c.currentUser?.role === "admin"

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
      {c.showCreate && (
        <CreateCommunityModal
          onClose={() => c.setShowCreate(false)}
          onCreate={c.onCreated}
        />
      )}
      {c.showSettings && c.active && c.currentUser && (
        <CommunitySettingsModal
          community={c.active}
          currentUserId={c.currentUser.id}
          canModerate={
            c.currentUser.role === "admin" ||
            c.active.owner._id === c.currentUser.id ||
            c.active.moderators?.some(
              (m) => m._id === c.currentUser?.id
            ) === true
          }
          canLeave={
            c.active.owner._id !== c.currentUser.id &&
            c.currentUser.role !== "admin"
          }
          onClose={() => c.setShowSettings(false)}
          onUpdate={(updated) => {
            c.setActive(updated)
            c.setCommunities((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
          }}
          onLeave={() => {
            void c.leaveActive()
            c.setShowSettings(false)
          }}
          onDelete={() => {
            if (confirm("Delete this community? This cannot be undone.")) {
              void c.deleteActive()
            }
            c.setShowSettings(false)
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
        currentUserId={c.currentUser?.id}
        canCreate={canCreate}
        onSelectCommunity={c.selectCommunity}
        onJoinClick={() => c.setShowJoin(true)}
        onCreateClick={() => c.setShowCreate(true)}
        mobileSidebarOpen={c.mobileSidebarOpen}
        onCloseMobile={() => c.setMobileSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col">
        {!c.active ? (
          <EmptyState />
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col">
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
            {c.active.isDisabled && (
              <div className="flex items-center gap-2 border-t border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                <ShieldOff className="size-4 shrink-0" />
                This community has been disabled. Messaging is disabled.
              </div>
            )}
            <MessageInput
              value={c.newMessage}
              onChange={c.setNewMessage}
              onSend={c.sendMessage}
              sending={c.sending}
              communityName={c.active.name}
              disabled={c.active.isDisabled}
            />
            <GuardOverlay mode="blackout" visible={guard.guarded} />
            <WatermarkCanvas
              enabled={watermarkEnabled}
              seed={c.currentUser?.id ?? ""}
              label={c.currentUser?.username}
            />
          </div>
        )}
      </div>
    </div>
  )
}
