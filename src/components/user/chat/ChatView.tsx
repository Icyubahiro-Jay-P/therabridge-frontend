import { useChatStore } from "@/store/chat-store"
import { ChatHeader } from "./ChatHeader"
import { MessageArea } from "./MessageArea"
import { MessageInput } from "./MessageInput"

export function ChatView({
  screenshotProtected,
  onToggleScreenshot,
  callState,
  onStartCall,
}: {
  screenshotProtected: boolean
  onToggleScreenshot: () => void
  callState?: string
  onStartCall?: () => void
}) {
  const partner = useChatStore((s) => s.partner)
  if (!partner) return null

  return (
    <>
      <ChatHeader
        onToggleSidebar={() => useChatStore.setState({ mobileSidebarOpen: true })}
        screenshotProtected={screenshotProtected}
        onToggleScreenshot={onToggleScreenshot}
        onCall={onStartCall}
        callDisabled={callState !== "idle"}
      />
      <MessageArea />
      <MessageInput partnerName={partner.firstName} />
    </>
  )
}
