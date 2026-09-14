import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useChatStore } from "@/store/chat-store"
import { useCommunityStore } from "@/store/community-store"
import { MessageArea as ChatMessageArea } from "@/components/user/chat/MessageArea"
import { MessageArea as CommunityMessageArea } from "@/components/user/community/MessageArea"
import type { DirectMessage } from "@/components/user/chat/types"
import type { CommunityMessage } from "@/components/user/community/types"

const ME = { _id: "me", username: "you", firstName: "You", lastName: "P" }
const MAYA = { _id: "maya", username: "maya", firstName: "Maya", lastName: "R" }

function iso(offsetSec: number) {
  return new Date(Date.now() + offsetSec * 1000).toISOString()
}

const dmMessages: DirectMessage[] = [
  {
    _id: "1",
    sender: MAYA,
    recipient: ME,
    content: "hey! are we still on for 3pm thursday?",
    read: true,
    createdAt: iso(-600),
  },
  {
    _id: "2",
    sender: ME,
    recipient: MAYA,
    content: "yes! I'll send the session link an hour before",
    read: true,
    createdAt: iso(-550),
    replyTo: {
      _id: "1",
      senderUsername: "maya",
      content: "hey! are we still on for 3pm thursday?",
    },
  },
  {
    _id: "3",
    sender: MAYA,
    recipient: ME,
    content: "perfect, one more thing",
    read: true,
    createdAt: iso(-500),
  },
  {
    _id: "4",
    sender: MAYA,
    recipient: ME,
    content: "",
    read: true,
    createdAt: iso(-490),
    type: "voice",
    audioUrl: "data:audio/webm;base64,",
    duration: 14,
    replyTo: {
      _id: "2",
      senderUsername: "you",
      content: "yes! I'll send the session link an hour before",
    },
  },
  {
    _id: "5",
    sender: ME,
    recipient: MAYA,
    content: "replying to your voice note",
    read: true,
    createdAt: iso(-400),
    replyTo: {
      _id: "4",
      senderUsername: "maya",
      content: "",
      type: "voice",
    },
  },
]

const communityMessages: CommunityMessage[] = [
  { _id: "c1", sender: MAYA, content: "morning everyone 👋", createdAt: iso(-600), readBy: ["maya", "me"] },
  {
    _id: "c2",
    sender: ME,
    content: "morning! excited for today",
    createdAt: iso(-590),
    readBy: ["me"],
    replyTo: { _id: "c1", senderUsername: "maya", content: "morning everyone 👋" },
  },
]

export function BubblePreview() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("dark")) {
      setTimeout(() => document.documentElement.classList.add("dark"), 0)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useAuthStore.setState({
      user: { id: "me", username: "you", firstName: "You", lastName: "P", role: "user" } as any,
    })
    useChatStore.setState({ messages: dmMessages, loadingMessages: false, error: null })
    useCommunityStore.setState({
      messages: communityMessages,
      loadingMessages: false,
      error: null,
    })
  }, [])

  return (
    <div className="grid min-h-screen grid-cols-1 gap-8 bg-white p-6 md:grid-cols-2 dark:bg-gray-950">
      <div>
        <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">1:1 Chat — replies</h2>
        <div className="flex h-[640px] flex-col rounded-xl border border-gray-200 dark:border-gray-800">
          <ChatMessageArea />
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">Community — replies</h2>
        <div className="flex h-[640px] flex-col rounded-xl border border-gray-200 dark:border-gray-800">
          <CommunityMessageArea />
        </div>
      </div>
    </div>
  )
}
