import { useCallback, useEffect, useRef, useState } from "react"
import { isScreenshotShortcut } from "@/lib/screenshotShortcuts"

export type ScreenshotGuardMode = "blur" | "blackout"

export type SensitivityEvent =
  | { type: "shortcut" }
  | { type: "hidden" }
  | { type: "visible" }
  | { type: "fullscreen-exit" }
  | { type: "page-hide" }
  | { type: "page-freeze" }

export interface UseScreenshotGuardOptions {
  mode?: ScreenshotGuardMode
  enabled?: boolean
  active?: boolean
  /** How long the blackout stays up after the tab becomes visible again (Snapchat-style). */
  blackoutRevealDelay?: number
  /** How long a pure shortcut press keeps the guard up before revealing. */
  shortcutHideDelay?: number
  onSensitivityEvent?: (event: SensitivityEvent) => void
}

/**
 * Reusable screenshot guard for any sensitive view. Handles blur-on-blur,
 * blackout-on-screenshot-shortcut, and blackout-on-unfocus with a short
 * reveal delay. Pair it with <GuardOverlay /> inside a `relative` container.
 */
export function useScreenshotGuard({
  mode = "blur",
  enabled = true,
  active = true,
  blackoutRevealDelay = 250,
  shortcutHideDelay = 400,
  onSensitivityEvent,
}: UseScreenshotGuardOptions = {}) {
  const [guarded, setGuarded] = useState(false)
  const clearTimerRef = useRef<number | null>(null)
  const onEventRef = useRef(onSensitivityEvent)

  useEffect(() => {
    onEventRef.current = onSensitivityEvent
  }, [onSensitivityEvent])

  const clearTimer = useCallback(() => {
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current)
      clearTimerRef.current = null
    }
  }, [])

  const scheduleClear = useCallback(
    (delay: number) => {
      clearTimer()
      clearTimerRef.current = window.setTimeout(() => {
        clearTimerRef.current = null
        setGuarded(false)
      }, delay)
    },
    [clearTimer],
  )

  const hide = useCallback(() => {
    clearTimer()
    setGuarded(true)
    onEventRef.current?.({ type: "hidden" })
  }, [clearTimer])

  const shortcut = useCallback(() => {
    setGuarded(true)
    onEventRef.current?.({ type: "shortcut" })
    scheduleClear(shortcutHideDelay)
  }, [scheduleClear, shortcutHideDelay])

  const reveal = useCallback(() => {
    if (mode === "blackout") {
      scheduleClear(blackoutRevealDelay)
    } else {
      clearTimer()
      setGuarded(false)
    }
    onEventRef.current?.({ type: "visible" })
  }, [mode, blackoutRevealDelay, scheduleClear, clearTimer])

  useEffect(() => {
    if (!enabled || !active) {
      clearTimer()
      return
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isScreenshotShortcut(e)) {
        e.preventDefault()
        e.stopImmediatePropagation()
        shortcut()
      }
    }

    function onVisibility() {
      if (document.hidden || document.visibilityState === "hidden") hide()
      else reveal()
    }

    function onWindowBlur() {
      hide()
    }

    function onWindowFocus() {
      reveal()
    }

    function onFullscreenChange() {
      if (!document.fullscreenElement) onEventRef.current?.({ type: "fullscreen-exit" })
    }

    function onVisibilityLifecycle() {
      // `freeze` is reported by the Page Lifecycle API when the browser freezes
      // the page - a common moment for screen-recording/capture to start.
      onEventRef.current?.({ type: "page-freeze" })
    }

    function onPageHide() {
      onEventRef.current?.({ type: "page-hide" })
    }

    window.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("blur", onWindowBlur)
    window.addEventListener("focus", onWindowFocus)
    document.addEventListener("fullscreenchange", onFullscreenChange)
    document.addEventListener("freeze", onVisibilityLifecycle)
    window.addEventListener("pagehide", onPageHide)

    return () => {
      window.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("blur", onWindowBlur)
      window.removeEventListener("focus", onWindowFocus)
      document.removeEventListener("fullscreenchange", onFullscreenChange)
      document.removeEventListener("freeze", onVisibilityLifecycle)
      window.removeEventListener("pagehide", onPageHide)
      clearTimer()
    }
  }, [enabled, active, hide, reveal, shortcut, clearTimer])

  return { guarded: enabled && active && guarded }
}
