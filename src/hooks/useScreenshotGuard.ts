import { useCallback, useEffect, useRef, useState } from "react"

export type ScreenshotGuardMode = "blur" | "blackout"

export interface UseScreenshotGuardOptions {
  mode?: ScreenshotGuardMode
  enabled?: boolean
  active?: boolean
  /** How long the blackout stays up after the tab becomes visible again (Snapchat-style). */
  blackoutRevealDelay?: number
}

/**
 * Reusable focus guard for any sensitive view. Obscures the view (blur) while
 * the tab/window loses focus and reveals it once the user returns. Pair it
 * with <GuardOverlay /> inside a `relative` container.
 */
export function useScreenshotGuard({
  mode = "blur",
  enabled = true,
  active = true,
  blackoutRevealDelay = 250,
}: UseScreenshotGuardOptions = {}) {
  const [guarded, setGuarded] = useState(false)
  const clearTimerRef = useRef<number | null>(null)

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
  }, [clearTimer])

  const reveal = useCallback(() => {
    if (mode === "blackout") {
      scheduleClear(blackoutRevealDelay)
    } else {
      clearTimer()
      setGuarded(false)
    }
  }, [mode, blackoutRevealDelay, scheduleClear, clearTimer])

  useEffect(() => {
    if (!enabled || !active) {
      clearTimer()
      return
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

    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("blur", onWindowBlur)
    window.addEventListener("focus", onWindowFocus)

    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("blur", onWindowBlur)
      window.removeEventListener("focus", onWindowFocus)
      clearTimer()
    }
  }, [enabled, active, hide, reveal, clearTimer])

  return { guarded: enabled && active && guarded }
}
