import { ConversationItem } from "./ConversationItem"
import { Loader2, MessageCircle } from "lucide-react"
import type { Conversation, ChatUser } from "./types"

export function ConversationList({
  loadingList,
  conversations,
  partner,
  onSelectConv,
  showPreviews,
}: {
  loadingList: boolean
  conversations: Conversation[]
  partner: ChatUser | null
  onSelectConv: (user: ChatUser) => void
  showPreviews: boolean
}) {
  if (loadingList) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <MessageCircle className="size-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-400">No conversations yet.</p>
        <p className="text-xs text-gray-400">Search for a user to start chatting!</p>
      </div>
    )
  }

  return (
    <>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.partner._id}
          conv={conv}
          isActive={partner?._id === conv.partner._id}
          onClick={() => onSelectConv(conv.partner)}
          showPreviews={showPreviews}
        />
      ))}
    </>
  )
}
