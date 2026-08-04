import type { ScreenshotGuardMode } from "@/hooks/useScreenshotGuard"

/**
 * Visual layer for useScreenshotGuard. Drop it inside the same `relative`
 * container as the guarded content.
 */
export function GuardOverlay({
  mode,
  visible,
}: {
  mode: ScreenshotGuardMode
  visible: boolean
}) {
  if (!visible) return null
  if (mode === "blackout") {
    return <div aria-hidden className="pointer-events-none absolute inset-0 z-[60] bg-black" />
  }
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[60] bg-white/20 backdrop-blur-xl dark:bg-black/20"
    />
  )
}
