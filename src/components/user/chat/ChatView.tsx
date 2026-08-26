import type { RefObject } from "react"
import { useChatStore } from "@/store/chat-store"
import { useAuthStore } from "@/store/auth-store"
import { ChatHeader } from "./ChatHeader"
import { MessageArea } from "./MessageArea"
import { MessageInput } from "./MessageInput"

export function ChatView({
  screenshotProtected,
  onToggleScreenshot,
  callState,
  onStartCall,
  messagesEndRef,
}: {
  screenshotProtected: boolean
  onToggleScreenshot: () => void
  callState?: string
  onStartCall?: () => void
  messagesEndRef: RefObject<HTMLDivElement | null>
}) {
  const partner = useChatStore((s) => s.partner)
  const error = useChatStore((s) => s.error)
  const loadingMessages = useChatStore((s) => s.loadingMessages)
  const messages = useChatStore((s) => s.messages)
  const currentUserId = useAuthStore((s) => s.user?.id)

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
      <MessageArea messagesEndRef={messagesEndRef} />
      <MessageInput partnerName={partner.firstName} />
    </>
  )
}
