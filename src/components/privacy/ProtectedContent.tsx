import type { ReactNode } from "react"
import { useProtectedContent } from "@/hooks/useProtectedContent"
import { GuardOverlay } from "./GuardOverlay"
import { WatermarkCanvas } from "./WatermarkCanvas"
import type { ContentType, ProtectionMode } from "@/lib/protectionTypes"

interface ProtectedContentProps {
  contentId: string
  contentType?: ContentType
  protectionMode?: ProtectionMode
  ownerId?: string
  enabled?: boolean
  active?: boolean
  /** Optional blurred/blackout mode for the guard overlay. */
  overlayMode?: "blur" | "blackout"
  /** Show a client-side watermark to deter casual copying. */
  watermarkEnabled?: boolean
  watermarkLabel?: string
  watermarkSeed?: string
  onCapture?: (info: { eventType: string; confidence: string }) => void
  children: ReactNode
}

/**
 * Reusable protected-content wrapper. Reusable for disappearing messages,
 * private photos/videos, sensitive documents, private profiles, etc.
 *
 * Web limitations are honest: it obscures content while the user switches
 * away and reports heuristic signals, but it cannot detect or prevent OS-level
 * screenshots/screen recording.
 */
export function ProtectedContent({
  contentId,
  contentType = "other",
  protectionMode = "notify",
  ownerId,
  enabled = true,
  active = true,
  overlayMode = "blackout",
  watermarkEnabled = false,
  watermarkLabel,
  watermarkSeed,
  onCapture,
  children,
}: ProtectedContentProps) {
  const { guarded } = useProtectedContent({
    contentId,
    contentType,
    protectionMode,
    ownerId,
    enabled,
    active,
    mode: overlayMode,
    onCapture,
  })

  return (
    <div className="relative">
      {children}
      <GuardOverlay mode={overlayMode} visible={guarded} />
      <WatermarkCanvas
        enabled={watermarkEnabled}
        seed={watermarkSeed ?? ""}
        label={watermarkLabel}
      />
    </div>
  )
}
