import { useEffect, useRef, useState } from "react"
import { Loader2, Menu } from "lucide-react"

import { useChatState } from "@/components/user/chat/useChatState"
import { useChatEffects } from "@/components/user/chat/useChatEffects"
import { useWebRTC } from "@/components/user/chat/useWebRTC"
import { Sidebar } from "@/components/user/chat/Sidebar"
import { EmptyState } from "@/components/user/chat/EmptyState"
import { ChatView } from "@/components/user/chat/ChatView"
import { VideoCallOverlay } from "@/components/user/chat/VideoCallOverlay"
import { TherryChat } from "@/components/user/chat/TherryChat"
import { ScreenshotOverlay } from "@/components/user/community/ScreenshotOverlay"
import { useScreenshotNotices } from "@/components/user/chat/useScreenshotNotices"
import { GuardOverlay } from "@/components/privacy/GuardOverlay"
import { WatermarkCanvas } from "@/components/privacy/WatermarkCanvas"
import { useScreenshotGuard } from "@/hooks/useScreenshotGuard"
import { loadSetting } from "@/components/user/chat/utils"
import { getSocket } from "@/lib/socket"
import type { DirectMessage } from "@/components/user/chat/types"

export function ChatPage() {
  const c = useChatState()
  useChatEffects({
    ...c,
    currentUserId: c.currentUser?.id,
    setEditingId: c.setEditingId,
    setEditingContent: c.setEditingContent,
  })

  const webrtc = useWebRTC()

  const partnerIdRef = useRef<string | null>(null)
  useEffect(() => {
    partnerIdRef.current = c.partner?._id ?? null
  })

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const currentUserId = c.currentUser?.id
    const setMessages = c.setMessages

    function onScreenshotNotice(data: {
      messageId: string
      initiatorId: string
      initiatorName: string
      conversationId: string
      timestamp: string
    }) {
      if (data.conversationId !== partnerIdRef.current) return
      if (data.initiatorId === currentUserId) return

      const notice: DirectMessage = {
        _id: data.messageId,
        sender: { _id: data.initiatorId, username: "", firstName: data.initiatorName, lastName: "" },
        recipient: { _id: data.conversationId, username: "", firstName: "", lastName: "" },
        content: `${data.initiatorName} took a screenshot`,
        read: false,
        createdAt: data.timestamp,
        kind: "screenshot-notice",
        noticeType: "possible_screenshot",
      }
      setMessages((prev) => {
        if (prev.some((m) => m._id === notice._id)) return prev
        return [...prev, notice]
      })
    }

    socket.on("possible_screenshot", onScreenshotNotice)
    return () => { socket.off("possible_screenshot", onScreenshotNotice) }
  }, [c.partner?._id, c.currentUser?.id, c.setMessages])

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
    active: !!c.partner && !c.isTherry,
    onSensitivityEvent: (e) => {
      if (e.type === "shortcut" && c.partner) {
        reportPossibleScreenshot(c.partner._id)
      }
    },
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

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <ScreenshotOverlay screenshotProtected={privacyShield.screenshotProtected} active={!!c.partner} />
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
        onTherryClick={() => { c.setMobileSidebarOpen(false); c.navigate("/chat/therry") }}
        suggestions={c.suggestions}
        loadingSuggestions={c.loadingSuggestions}
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
              partner={c.partner}
              onToggleSidebar={() => c.setMobileSidebarOpen(true)}
              screenshotProtected={privacyShield.screenshotProtected}
              onToggleScreenshot={toggleScreenshotProtection}
              error={c.error}
              loadingMessages={c.loadingMessages}
              messages={c.messages}
              currentUserId={c.currentUser?.id}
              editingId={c.editingId}
              editingContent={c.editingContent}
              setEditingContent={c.setEditingContent}
              onStartEdit={c.startEdit}
              onReply={c.startReply}
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
              onSendVoice={c.sendVoiceNote}
              enterToSend={c.enterToSend}
              replyTo={c.replyToMessage}
              onCancelReply={c.cancelReply}
              onLoadOlder={c.loadOlderMessages}
              loadingOlder={c.loadingOlder}
              hasOlder={c.hasOlderMessages}
              callState={webrtc.callState}
              onStartCall={() => webrtc.startCall(c.partner!._id)}
            />
            <GuardOverlay mode="blackout" visible={guard.guarded} />
            <WatermarkCanvas
              enabled={privacyShield.watermarkEnabled}
              seed={c.currentUser?.id ?? ""}
              label={c.currentUser?.username}
            />
          </div>
        )}
      </div>

      {/* Video call overlay - rendered at page level so incoming calls show
          even when the user is viewing a different conversation or no conversation */}
      {c.currentUser?.id && (
        <VideoCallOverlay
          userId={c.currentUser.id}
          callState={(webrtc.callState ?? "idle") as "idle" | "calling" | "ringing" | "connecting" | "connected" | "ended"}
          peerId={webrtc.peerId}
          localStream={webrtc.localStream ?? null}
          remoteStream={webrtc.remoteStream ?? null}
          incomingCall={webrtc.incomingCall ?? null}
          isMuted={webrtc.isMuted ?? false}
          isVideoOff={webrtc.isVideoOff ?? false}
          acceptCall={webrtc.acceptCall}
          rejectCall={webrtc.rejectCall}
          endCall={webrtc.endCall}
          toggleMute={webrtc.toggleMute}
          toggleVideo={webrtc.toggleVideo}
          partnerName={
            webrtc.incomingCall?.callerName
            ?? (c.partner ? `${c.partner.firstName} ${c.partner.lastName}` : "")
          }
          partnerAvatar={c.partner?.avatar ?? undefined}
        />
      )}
    </div>
  )
}
