import { useScreenshotGuard } from "./useScreenshotGuard"

export interface UseProtectedContentOptions {
  contentId: string
  contentType?: "message" | "community" | "photo" | "video" | "document" | "profile" | "other"
  protectionMode?: "notify" | "block"
  ownerId?: string
  enabled?: boolean
  active?: boolean
  mode?: "blur" | "blackout"
  onCapture?: (info: { eventType: string; confidence: string }) => void
}

export interface ProtectedContentState {
  guarded: boolean
  sessionReady: boolean
}

/**
 * Reusable protected-content hook. Obscures the view (blur/blackout) while the
 * tab or window loses focus and reveals it once the user returns. It does NOT
 * attempt to detect screenshots or send any capture notification.
 */
export function useProtectedContent({
  enabled = true,
  active = true,
  mode = "blackout",
}: UseProtectedContentOptions): ProtectedContentState {
  const guard = useScreenshotGuard({ mode, enabled, active })

  return { guarded: guard.guarded, sessionReady: false }
}
