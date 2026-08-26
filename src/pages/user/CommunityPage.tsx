import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldOff } from "lucide-react"
import { useCommunityState } from "@/components/user/community/useCommunityState"
import { useCommunityEffects } from "@/components/user/community/useCommunityEffects"
import { useMessagePolling } from "@/components/user/community/useMessagePolling"
import { useCommunityStore } from "@/store/community-store"
import { useAuthStore } from "@/store/auth-store"
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
import type { Community } from "@/components/user/community/types"

export function CommunityPage() {
  useCommunityState()
  useCommunityEffects()
  useMessagePolling()

  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const active = useCommunityStore((s) => s.active)
  const screenshotProtected = useCommunityStore((s) => s.screenshotProtected)
  const showJoin = useCommunityStore((s) => s.showJoin)
  const showCreate = useCommunityStore((s) => s.showCreate)
  const showSettings = useCommunityStore((s) => s.showSettings)

  const watermarkEnabled = loadSetting("watermarkEnabled", false)
  const guard = useScreenshotGuard({
    mode: "blackout",
    enabled: screenshotProtected,
    active: !!active,
  })
  const canCreate =
    currentUser?.role === "therapist" || currentUser?.role === "admin"

  const handleSelectCommunity = useCallback((c: Community) => {
    useCommunityStore.getState().selectCommunity(c)
    navigate(`/community/${c.inviteKey}`)
  }, [navigate])

  const handleJoin = useCallback((c2: Community) => {
    useCommunityStore.getState().setCommunities((prev) =>
      prev.find((p) => p._id === c2._id) ? prev : [c2, ...prev],
    )
    handleSelectCommunity(c2)
  }, [handleSelectCommunity])

  return (
    <div className="flex h-full overflow-hidden select-none">
      <ScreenshotOverlay screenshotProtected={screenshotProtected} active={active} />
      {showJoin && (
        <JoinCommunityModal
          onClose={() => useCommunityStore.setState({ showJoin: false })}
          onJoin={handleJoin}
        />
      )}
      {showCreate && (
        <CreateCommunityModal
          onClose={() => useCommunityStore.setState({ showCreate: false })}
          onCreate={useCommunityStore.getState().onCreated}
        />
      )}
      {showSettings && active && currentUser && (
        <CommunitySettingsModal
          community={active}
          currentUserId={currentUser.id}
          canModerate={
            currentUser.role === "admin" ||
            active.owner._id === currentUser.id ||
            active.moderators?.some(
              (m) => m._id === currentUser?.id,
            ) === true
          }
          canLeave={
            active.owner._id !== currentUser.id &&
            currentUser.role !== "admin"
          }
          onClose={() => useCommunityStore.setState({ showSettings: false })}
          onUpdate={(updated) => {
            useCommunityStore.setState((state) => ({
              active: updated,
              communities: state.communities.map((p) =>
                p._id === updated._id ? updated : p,
              ),
            }))
          }}
          onLeave={() => {
            void useCommunityStore.getState().leaveActive()
            useCommunityStore.setState({ showSettings: false })
          }}
          onDelete={() => {
            if (confirm("Delete this community? This cannot be undone.")) {
              void useCommunityStore.getState().deleteActive()
            }
            useCommunityStore.setState({ showSettings: false })
          }}
        />
      )}
      <Sidebar
        onSelectCommunity={handleSelectCommunity}
        onJoinClick={() => useCommunityStore.setState({ showJoin: true })}
        onCreateClick={() => useCommunityStore.setState({ showCreate: true })}
        canCreate={canCreate}
      />
      <div className="flex flex-1 flex-col">
        {!active ? (
          <EmptyState />
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col">
            <ChatHeader />
            <MessageArea />
            {active.isDisabled && (
              <div className="flex items-center gap-2 border-t border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                <ShieldOff className="size-4 shrink-0" />
                This community has been disabled. Messaging is disabled.
              </div>
            )}
            <MessageInput communityName={active.name} disabled={active.isDisabled} />
            <GuardOverlay mode="blackout" visible={guard.guarded} />
            <WatermarkCanvas
              enabled={watermarkEnabled}
              seed={currentUser?.id ?? ""}
              label={currentUser?.username}
            />
          </div>
        )}
      </div>
    </div>
  )
}
