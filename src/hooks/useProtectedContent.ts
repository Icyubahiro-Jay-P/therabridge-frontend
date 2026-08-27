import { useCallback, useEffect, useRef, useState } from "react"
import { useScreenshotGuard } from "./useScreenshotGuard"
import { classifySensitivitySignal, type SensitivitySignal } from "@/lib/classification"
import { openProtectedSession, reportScreenshotEvent, clearProtectedSession } from "@/lib/screenshotEvents"
import { WEB_PLATFORM } from "@/lib/protectionTypes"
import type { ContentType, ProtectionMode, CaptureEventType } from "@/lib/protectionTypes"
import { isScreenshotShortcut } from "@/lib/screenshotShortcuts"

export interface UseProtectedContentOptions {
  contentId: string
  contentType?: ContentType
  protectionMode?: ProtectionMode
  ownerId?: string
  enabled?: boolean
  active?: boolean
  mode?: "blur" | "blackout"
  onCapture?: (info: { eventType: CaptureEventType; confidence: string }) => void
}

export interface ProtectedContentState {
  guarded: boolean
  sessionReady: boolean
}

/**
 * Reusable protected-content hook. Creates a server-issued viewing session,
 * wires classifier-driven blur/blackout + shortcut guards, and reports
 * screenshot/capture events to the backend (client- and server-deduped).
 *
 * Honest contract: the web only ever yields HEURISTIC signals. It can obscure
 * content while the user is away, but it cannot detect or prevent OS-level
 * captures, and never claims to.
 */
export function useProtectedContent({
  contentId,
  contentType = "other",
  protectionMode = "notify",
  ownerId,
  enabled = true,
  active = true,
  mode = "blackout",
  onCapture,
}: UseProtectedContentOptions): ProtectedContentState {
  const [sessionReady, setSessionReady] = useState(false)

  // Keep the latest options available to async callbacks without forcing
  // re-subscriptions. Updated in an effect (never during render).
  const optsRef = useRef({ contentType, protectionMode, ownerId })
  useEffect(() => {
    optsRef.current = { contentType, protectionMode, ownerId }
  }, [contentType, protectionMode, ownerId])

  const report = useCallback(
    (signal: SensitivitySignal) => {
      if (!contentId) return
      const classification = classifySensitivitySignal(signal)
      void reportScreenshotEvent(
        {
          contentId,
          contentType: optsRef.current.contentType,
          platform: WEB_PLATFORM.platform,
          detectionMethod: classification.detectionMethod,
          confidence: classification.confidence,
          eventType: classification.eventType,
        },
        { contentId, eventType: classification.eventType },
      ).then(() => {
        onCapture?.({ eventType: classification.eventType, confidence: classification.confidence })
      })
    },
    [contentId, onCapture],
  )

  // Create the viewing session when protection is active and we have a contentId.
  useEffect(() => {
    const shouldOpen = enabled && active && !!contentId
    setSessionReady(false)
    if (!shouldOpen) return

    let cancelled = false
    void openProtectedSession({
      contentId,
      contentType: optsRef.current.contentType,
      protectionMode: optsRef.current.protectionMode,
      platform: WEB_PLATFORM.platform,
      ownerId: optsRef.current.ownerId,
    }).then((s) => {
      if (!cancelled && s) setSessionReady(true)
    })
    return () => {
      cancelled = true
      clearProtectedSession(contentId)
    }
  }, [enabled, active, contentId])

  // Shortcut guard: PrtScr etc is a *probable* signal, not confirmation.
  useEffect(() => {
    if (!enabled || !active || !contentId) return
    function onKeyDown(e: KeyboardEvent) {
      if (isScreenshotShortcut(e)) {
        e.preventDefault()
        e.stopPropagation()
        report("screenshot-shortcut")
      }
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [enabled, active, contentId, report])

  const guard = useScreenshotGuard({
    mode,
    enabled,
    active,
    onSensitivityEvent: (ev) => {
      if (ev.type === "hidden") report("visibility-hidden")
      if (ev.type === "visible") report("window-focus")
      if (ev.type === "fullscreen-exit") report("visibility-hidden")
    },
  })

  return { guarded: guard.guarded, sessionReady }
}
