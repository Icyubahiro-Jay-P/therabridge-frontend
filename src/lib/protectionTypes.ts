// Shared types for the screenshot-detection / protection system.
//
// The browser does NOT have reliable access to OS-level screenshot events.
// These types make that explicit: the web is always heuristic, and confidence
// is never "confirmed" from a web signal.

export type Platform = "web" | "android" | "ios"

export type DetectionMethod =
  | "android_os"
  | "ios_os"
  | "web_heuristic"
  | "web_visibility"
  | "manual"
  | "unknown"

export type Confidence = "confirmed" | "probable" | "heuristic" | "unknown"

export type CaptureEventType =
  | "SCREENSHOT"
  | "SCREEN_RECORDING"
  | "SCREEN_CAPTURE"
  | "UNKNOWN_CAPTURE"

export type ProtectionMode = "notify" | "prevent" | "notify-and-prevent"

export type ContentType =
  | "message"
  | "snap"
  | "photo"
  | "video"
  | "document"
  | "profile"
  | "other"

export interface PlatformCapability {
  platform: Platform
  detectionCapability: "os-level" | "heuristic"
  canPrevent: boolean
}

// Honest platform capability map. The web can only ever be heuristic and can
// NEVER truly prevent a capture. Only the (not-yet-built) native apps get
// os-level detection / prevention.
export const PLATFORM_CAPABILITIES: Record<Platform, PlatformCapability> = {
  web: {
    platform: "web",
    detectionCapability: "heuristic",
    canPrevent: false,
  },
  android: {
    platform: "android",
    detectionCapability: "os-level",
    canPrevent: true,
  },
  ios: {
    platform: "ios",
    detectionCapability: "os-level",
    canPrevent: true,
  },
}

export const WEB_PLATFORM: PlatformCapability = PLATFORM_CAPABILITIES.web

export interface ScreenshotEventPayload {
  contentId: string
  contentType: ContentType
  sessionToken: string
  platform: Platform
  detectionMethod: DetectionMethod
  confidence: Confidence
  eventType: CaptureEventType
  eventId?: string
  detectedAt?: string
}

export interface ViewingSessionPayload {
  contentId: string
  contentType: ContentType
  protectionMode: ProtectionMode
  platform: Platform
  ownerId?: string
}
