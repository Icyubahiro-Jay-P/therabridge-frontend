import { useEffect, useRef } from "react"
import { ArrowUp, Loader2, MessageCircle, TriangleAlert } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ReactNode } from "react"

const STICK_TO_BOTTOM_THRESHOLD = 80
const LOAD_OLDER_THRESHOLD = 60

export function MessageArea({
  error,
  loadingMessages,
  messages,
  renderMessage,
  emptyMessage = "No messages yet. Say hello!",
  scrollToBottom = true,
  onLoadOlder,
  loadingOlder = false,
  hasOlder = false,
}: {
  error: string | null
  loadingMessages: boolean
  messages: unknown[]
  renderMessage: (msg: unknown, index: number) => ReactNode
  emptyMessage?: string
  scrollToBottom?: boolean
  onLoadOlder?: () => void
  loadingOlder?: boolean
  hasOlder?: boolean
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stickToBottomRef = useRef(scrollToBottom)
  const prevScrollHeightRef = useRef(0)
  const scrollToBottomRef = useRef(scrollToBottom)
  const onLoadOlderRef = useRef(onLoadOlder)
  const loadingOlderRef = useRef(loadingOlder)
  const hasOlderRef = useRef(hasOlder)
  scrollToBottomRef.current = scrollToBottom
  onLoadOlderRef.current = onLoadOlder
  loadingOlderRef.current = loadingOlder
  hasOlderRef.current = hasOlder

  function handleScroll() {
    const viewport = viewportRef.current
    if (!viewport) return
    stickToBottomRef.current =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <
      STICK_TO_BOTTOM_THRESHOLD
    if (
      !loadingOlderRef.current &&
      hasOlderRef.current &&
      onLoadOlderRef.current &&
      viewport.scrollTop < LOAD_OLDER_THRESHOLD
    ) {
      onLoadOlderRef.current()
    }
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    viewport.addEventListener("scroll", handleScroll, { passive: true })
    return () => viewport.removeEventListener("scroll", handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const prev = prevScrollHeightRef.current
    if (prev > 0) {
      const added = viewport.scrollHeight - prev
      if (added > 0 && !stickToBottomRef.current) {
        viewport.scrollTop += added
      }
    }
    prevScrollHeightRef.current = viewport.scrollHeight
  }, [messages])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !scrollToBottomRef.current) return
    if (prevScrollHeightRef.current === 0 || stickToBottomRef.current) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages, scrollToBottom])

  return (
    <ScrollArea className="min-h-0 flex-1 px-5 py-4" viewportRef={viewportRef}>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="inline size-4 shrink-0" /> {error}
        </div>
      )}
      {loadingMessages ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      ) : !Array.isArray(messages) || messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
          <MessageCircle className="size-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {hasOlder && (
            <div className="mb-2 flex items-center justify-center">
              {loadingOlder ? (
                <Loader2 className="size-4 animate-spin text-gray-400" />
              ) : (
                <button
                  onClick={() => onLoadOlder?.()}
                  className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs text-gray-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <ArrowUp className="size-3" /> Load earlier messages
                </button>
              )}
            </div>
          )}
          {messages.map((msg, i) => renderMessage(msg, i))}
        </>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  )
}
