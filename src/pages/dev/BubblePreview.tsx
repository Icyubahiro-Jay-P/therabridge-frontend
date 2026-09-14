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
const SAM = { _id: "sam", username: "sam", firstName: "Sam", lastName: "K" }

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
    sender: MAYA,
    recipient: ME,
    content: "no rush, just checking 🌿",
    read: true,
    createdAt: iso(-580),
  },
  {
    _id: "3",
    sender: ME,
    recipient: MAYA,
    content: "yes! I'll send the session link an hour before",
    read: true,
    readAt: iso(-500),
    createdAt: iso(-550),
    edited: true,
    editCount: 1,
    replyTo: {
      _id: "1",
      senderUsername: "maya",
      content: "hey! are we still on for 3pm thursday?",
    },
  },
  {
    _id: "4",
    sender: ME,
    recipient: MAYA,
    content: "sound good?",
    read: true,
    readAt: iso(-500),
    createdAt: iso(-540),
  },
  {
    _id: "5",
    sender: MAYA,
    recipient: ME,
    content: "perfect, talk then!",
    read: false,
    createdAt: iso(-60),
  },
]

const communityMessages: CommunityMessage[] = [
  { _id: "c1", sender: MAYA, content: "morning everyone 👋", createdAt: iso(-600), readBy: ["maya", "sam", "me"] },
  { _id: "c2", sender: MAYA, content: "how's the week going so far?", createdAt: iso(-590), readBy: ["maya", "sam", "me"] },
  { _id: "c3", sender: SAM, content: "pretty good, just finished a session", createdAt: iso(-560), readBy: ["sam", "me"] },
  { _id: "c4", sender: ME, content: "same here, feeling good about it", createdAt: iso(-500), readBy: ["me", "maya"] },
  { _id: "c5", sender: ME, content: "small win today 🎉", createdAt: iso(-495), readBy: ["me"] },
]

export function BubblePreview() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("dark")) {
      // Beats ThemeProvider's own effect, which runs after this one and
      // would otherwise reset the class back to the system preference.
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
        <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">1:1 Chat (Instagram DM style)</h2>
        <div className="flex h-[560px] flex-col rounded-xl border border-gray-200 dark:border-gray-800">
          <ChatMessageArea />
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">Community (Instagram group-chat style)</h2>
        <div className="flex h-[560px] flex-col rounded-xl border border-gray-200 dark:border-gray-800">
          <CommunityMessageArea />
        </div>
      </div>
    </div>
  )
}
