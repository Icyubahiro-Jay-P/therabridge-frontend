import { useCallback, useRef } from "react"
import { api } from "@/lib/api"
import { getSocket } from "@/lib/socket"

const CLIENT_COOLDOWN_MS = 5000

/**
 * Emits "possible screenshot" signals for the open conversation. Prefers the
 * real-time socket; falls back to the REST endpoint when the socket is not
 * connected. The server enforces its own rate limit too.
 */
export function useScreenshotNotices() {
  const lastEmitAtRef = useRef(0)

  const report = useCallback((conversationId: string) => {
    const now = Date.now()
    if (now - lastEmitAtRef.current < CLIENT_COOLDOWN_MS) return
    lastEmitAtRef.current = now

    const socket = getSocket()
    if (socket?.connected) {
      socket.emit("possible_screenshot", { conversationId })
      return
    }
    void api
      .post("/api/chat/screenshot-notice", { recipientId: conversationId })
      .catch(() => {})
  }, [])

  return { reportPossibleScreenshot: report }
}
