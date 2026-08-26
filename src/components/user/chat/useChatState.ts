import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useChatStore } from "@/store/chat-store"

/**
 * Thin hook that syncs route params into the Zustand chat store and sets up
 * local-only side effects (scroll, suggestions, search debounce, menu click).
 * All real state lives in useChatStore.
 */
export function useChatState() {
  const { username } = useParams<{ username: string }>()
  const isTherry = username === "therry"

  // ── Sync route params to store ──
  useEffect(() => {
    useChatStore.setState({ username, isTherry })
  }, [username, isTherry])

  // ── Scroll into view when messages change ──
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messages = useChatStore((s) => s.messages)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Load suggestions once the conversation list finishes loading ──
  const loadingList = useChatStore((s) => s.loadingList)
  const suggestionsLoadedRef = useRef(false)
  useEffect(() => {
    if (loadingList || suggestionsLoadedRef.current) return
    suggestionsLoadedRef.current = true
    let mounted = true
    void (async () => {
      useChatStore.setState({ loadingSuggestions: true })
      try {
        const { data } = await import("@/lib/api").then((m) =>
          m.api.get<import("./types").ChatUser[]>("/api/chat/suggestions"),
        )
        if (mounted) useChatStore.setState({ suggestions: Array.isArray(data) ? data : [] })
      } catch {
        if (mounted) useChatStore.setState({ suggestions: [] })
      } finally {
        if (mounted) useChatStore.setState({ loadingSuggestions: false })
      }
    })()
    return () => { mounted = false }
  }, [loadingList])

  // ── Search debounce ──
  const searchQuery = useChatStore((s) => s.searchQuery)
  useEffect(() => {
    if (searchQuery.length < 3) return
    const timeout = setTimeout(async () => {
      useChatStore.setState({ searching: true })
      try {
        const { data } = await import("@/lib/api").then((m) =>
          m.api.get<import("./types").ChatUser[]>(
            `/api/chat/search?q=${encodeURIComponent(searchQuery)}`,
          ),
        )
        useChatStore.setState({ searchResults: data })
      } catch {
        useChatStore.setState({ searchResults: [] })
      } finally {
        useChatStore.setState({ searching: false })
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  // ── Close open menus on outside click ──
  useEffect(() => {
    function handleClick() { useChatStore.setState({ menuOpenId: null }) }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return { username, isTherry, messagesEndRef }
}
