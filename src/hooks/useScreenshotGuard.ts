import { useCallback, useEffect, useRef, useState } from "react"

export type ScreenshotGuardMode = "blur" | "blackout"

export type SensitivityEvent =
  | { type: "shortcut" }
  | { type: "hidden" }
  | { type: "visible" }

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

function isScreenshotShortcut(e: KeyboardEvent): boolean {
  const k = e.key.toLowerCase()
  if (e.key === "PrintScreen") return true
  if (e.altKey && e.key === "PrintScreen") return true
  if (e.metaKey && e.shiftKey && (k === "s" || k === "3" || k === "4" || k === "5"))
    return true
  if (e.ctrlKey && e.metaKey && e.shiftKey && (k === "3" || k === "4")) return true
  return false
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

    window.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("blur", onWindowBlur)
    window.addEventListener("focus", onWindowFocus)

    return () => {
      window.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("blur", onWindowBlur)
      window.removeEventListener("focus", onWindowFocus)
      clearTimer()
    }
  }, [enabled, active, hide, reveal, shortcut, clearTimer])

  return { guarded }
}
