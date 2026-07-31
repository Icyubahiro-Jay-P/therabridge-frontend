import { ConversationItem } from "./ConversationItem"
import { BotIcon, Loader2, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Conversation, ChatUser } from "./types"

export function ConversationList({
  loadingList,
  conversations,
  partner,
  onSelectConv,
  showPreviews,
  isTherry,
  onTherryClick,
}: {
  loadingList: boolean
  conversations: Conversation[]
  partner: ChatUser | null
  onSelectConv: (user: ChatUser) => void
  showPreviews: boolean
  isTherry: boolean
  onTherryClick: () => void
}) {
  if (loadingList) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <>
      <button
        onClick={onTherryClick}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors",
          isTherry
            ? "bg-emerald-50 dark:bg-emerald-800/50"
            : "hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
      >
        <span className="relative">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <BotIcon className="size-5" />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              Therry
            </p>
          </div>
          <p className="truncate text-xs text-gray-400">
            Your AI wellness companion
          </p>
        </div>
      </button>

      {!Array.isArray(conversations) || conversations.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
          <MessageCircle className="size-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400">No conversations yet.</p>
          <p className="text-xs text-gray-400">
            Search for a user to start chatting!
          </p>
        </div>
      ) : (
        conversations.map((conv) => (
          <ConversationItem
            key={conv.partner._id}
            conv={conv}
            isActive={partner?._id === conv.partner._id}
            onClick={() => onSelectConv(conv.partner)}
            showPreviews={showPreviews}
          />
        ))
      )}
    </>
  )
}
