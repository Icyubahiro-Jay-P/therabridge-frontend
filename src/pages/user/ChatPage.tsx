import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Menu } from "lucide-react"

import { useChatState } from "@/components/user/chat/useChatState"
import { useChatEffects } from "@/components/user/chat/useChatEffects"
import { useWebRTC } from "@/components/user/chat/useWebRTC"
import { useChatStore } from "@/store/chat-store"
import { useAuthStore } from "@/store/auth-store"
import { ScreenshotOverlay } from "@/components/user/community/ScreenshotOverlay"
import { GuardOverlay } from "@/components/privacy/GuardOverlay"
import { WatermarkCanvas } from "@/components/privacy/WatermarkCanvas"
import { useScreenshotGuard } from "@/hooks/useScreenshotGuard"
import { loadSetting } from "@/components/user/chat/utils"
import type { ChatUser } from "@/components/user/chat/types"
import type { DirectMessage } from "@/components/user/chat/types"

import { Sidebar } from "@/components/user/chat/Sidebar"
import { EmptyState } from "@/components/user/chat/EmptyState"
import { ChatView } from "@/components/user/chat/ChatView"
import { VideoCallOverlay } from "@/components/user/chat/VideoCallOverlay"
import { TherryChat } from "@/components/user/chat/TherryChat"

export function ChatPage() {
  const { username, isTherry } = useChatState()
  useChatEffects(username)

  const navigate = useNavigate()
  const webrtc = useWebRTC()

  const partner = useChatStore((s) => s.partner)
  const currentUser = useAuthStore((s) => s.user)

  // ── Privacy shield state (localStorage-backed) ──
  const [privacyShield, setPrivacyShield] = useState(() => ({
    screenshotProtected: loadSetting("screenshotProtection", false),
    watermarkEnabled: loadSetting("watermarkEnabled", false),
  }))

  useEffect(() => {
    function refresh() {
      setPrivacyShield({
        screenshotProtected: loadSetting("screenshotProtection", false),
        watermarkEnabled: loadSetting("watermarkEnabled", false),
      })
    }
    window.addEventListener("storage", refresh)
    window.addEventListener("screenshot-protection-change", refresh)
    const interval = setInterval(refresh, 2000)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("screenshot-protection-change", refresh)
      clearInterval(interval)
    }
  }, [])

  const { reportPossibleScreenshot } = useScreenshotNotices()
  const guard = useScreenshotGuard({
    mode: "blackout",
    enabled: privacyShield.screenshotProtected,
    active: !!partner && !isTherry,
    onSensitivityEvent: (e) => {
      if (e.type === "shortcut" && partner) {
        reportPossibleScreenshot(partner._id)
      }
    },
  })

  // Viewer-session-gated screenshot reporting (audit + bell notification).
  // Kept alongside the legacy in-thread chip so both the paper trail and the
  // real-time UX are preserved without double-reporting to the same endpoint.
  useProtectedContent({
    contentId: partner?._id ?? "",
    contentType: "message",
    protectionMode: "notify",
    ownerId: partner?._id,
    enabled: privacyShield.screenshotProtected,
    active: !!partner && !isTherry && !!currentUser?.id,
  })

  function toggleScreenshotProtection() {
    setPrivacyShield((prev) => {
      const next = !prev.screenshotProtected
      try {
        const stored = localStorage.getItem("therabridge-settings")
        const s = stored ? JSON.parse(stored) : {}
        s.screenshotProtection = next
        localStorage.setItem("therabridge-settings", JSON.stringify(s))
      } catch { /* localStorage unavailable */ }
      window.dispatchEvent(new CustomEvent("screenshot-protection-change", { detail: next }))
      return { ...prev, screenshotProtected: next }
    })
  }

  const handleOpenDM = useCallback((user: ChatUser) => {
    useChatStore.getState().openDM()
    navigate(`/chat/${user.username}`)
  }, [navigate])

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <ScreenshotOverlay screenshotProtected={privacyShield.screenshotProtected} active={!!partner} />
      <Sidebar
        onSelectUser={handleOpenDM}
        onSelectConv={handleOpenDM}
        onTherryClick={() => {
          useChatStore.setState({ mobileSidebarOpen: false })
          navigate("/chat/therry")
        }}
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        {isTherry ? (
          <TherryChat onToggleSidebar={() => useChatStore.setState({ mobileSidebarOpen: true })} />
        ) : !partner ? (
          username ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="flex items-center border-b border-gray-200 px-4 py-3.5 md:hidden dark:border-gray-700/60">
                <button
                  onClick={() => useChatStore.setState({ mobileSidebarOpen: true })}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="size-4 text-gray-500" />
                </button>
                <span className="ml-2 text-sm font-medium text-gray-500">Chats</span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <div className="grid min-h-0 flex-1 place-items-center">
                  <EmptyState />
                </div>
              </div>
            </>
          )
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col">
            <ChatView
              screenshotProtected={privacyShield.screenshotProtected}
              onToggleScreenshot={toggleScreenshotProtection}
              callState={webrtc.callState}
              onStartCall={() => webrtc.startCall(partner._id)}
            />
            <GuardOverlay mode="blackout" visible={guard.guarded} />
            <WatermarkCanvas
              enabled={privacyShield.watermarkEnabled}
              seed={currentUser?.id ?? ""}
              label={currentUser?.username}
            />
          </div>
        )}
      </div>

      {currentUser?.id && (
        <VideoCallOverlay
          userId={currentUser.id}
          callState={webrtc.callState}
          peerId={webrtc.peerId}
          localStream={webrtc.localStream}
          remoteStream={webrtc.remoteStream}
          incomingCall={webrtc.incomingCall}
          isMuted={webrtc.isMuted}
          isVideoOff={webrtc.isVideoOff}
          acceptCall={webrtc.acceptCall}
          rejectCall={webrtc.rejectCall}
          endCall={webrtc.endCall}
          toggleMute={webrtc.toggleMute}
          toggleVideo={webrtc.toggleVideo}
          partnerName={
            webrtc.incomingCall?.callerName
            ?? (partner ? `${partner.firstName} ${partner.lastName}` : "")
          }
          partnerAvatar={
            webrtc.incomingCall?.callerAvatar
            ?? partner?.avatar
            ?? undefined
          }
        />
      )}
    </div>
  )
}
