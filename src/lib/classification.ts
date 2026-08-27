import type {
  CaptureEventType,
  Confidence,
  DetectionMethod,
} from "./protectionTypes"

// ============================================================================
// Honest browser-signal classification.
//
// A normal web browser does NOT have reliable access to OS-level screenshot
// events. We do NOT claim that JavaScript can detect Print Screen, Windows
// Snipping Tool, macOS screenshots, Linux screenshot tools, or captures taken
// by another application.
//
// We monitor only signals the browser genuinely exposes (visibility, focus,
// lifecycle, fullscreen) and treat them as HEURISTICS. Nothing here is proof a
// capture happened; it only tells us "something attention-worthy occurred".
// ============================================================================

export type SensitivitySignal =
  | "screenshot-shortcut" // PrtScr / Cmd+Shift+3/4/5 / Win+Shift+S keydown
  | "visibility-hidden" // tab or page became hidden while content was active
  | "window-blur" // window lost focus
  | "window-focus" // window regained focus
  | "page-freeze" // Page Lifecycle freeze (bg tab, potential capture/recording)
  | "page-hide" // pagehide / bfcache / unload
  | "fullscreen-exit" // left fullscreen (common during OS-level capture)
  | "recording-heuristic" // best-effort; treated as unknown unless proven

export interface Classification {
  eventType: CaptureEventType
  confidence: Confidence
  detectionMethod: DetectionMethod
  /** Human-readable reason, for logging only. */
  note: string
}

const UNKNOWN: Classification = {
  eventType: "UNKNOWN_CAPTURE",
  confidence: "unknown",
  detectionMethod: "unknown",
  note: "no trustworthy browser signal; not reported as detection",
}

const SCREENSHOT_SHORTCUT: Classification = {
  eventType: "SCREENSHOT",
  confidence: "probable",
  // A captured screenshot shortcut key is a real signal that a screenshot was
  // very likely initiated - but we still can't prove it completed, hence
  // "probable" and "web_heuristic", never "confirmed".
  detectionMethod: "web_heuristic",
  note: "screenshot shortcut key pressed - probable, not confirmed",
}

export function classifySensitivitySignal(
  signal: SensitivitySignal,
): Classification {
  switch (signal) {
    case "screenshot-shortcut":
      return SCREENSHOT_SHORTCUT
    case "visibility-hidden":
      // User left the page/tab. They may have switched away to read, opened
      // another app to capture, or simply tabbed out to a message. Heuristic.
      return {
        eventType: "SCREENSHOT",
        confidence: "heuristic",
        detectionMethod: "web_visibility",
        note: "page became hidden while sensitive content was active - heuristic",
      }
    case "window-blur":
      return {
        eventType: "SCREENSHOT",
        confidence: "heuristic",
        detectionMethod: "web_visibility",
        note: "window lost focus - heuristic (not proof of a capture)",
      }
    case "window-focus":
      return {
        eventType: "UNKNOWN_CAPTURE",
        confidence: "unknown",
        detectionMethod: "web_visibility",
        note: "window regained focus - not reported as detection",
      }
    case "page-freeze":
      // Page Lifecycle freeze: the browser froze the page (often right before
      // the user captures/records). Still only a heuristic.
      return {
        eventType: "SCREEN_RECORDING",
        confidence: "heuristic",
        detectionMethod: "web_visibility",
        note: "page lifecycle freeze - possible screen recording, heuristic",
      }
    case "page-hide":
      return {
        eventType: "SCREENSHOT",
        confidence: "heuristic",
        detectionMethod: "web_visibility",
        note: "pagehide - heuristic",
      }
    case "fullscreen-exit":
      return {
        eventType: "SCREENSHOT",
        confidence: "heuristic",
        detectionMethod: "web_visibility",
        note: "exited fullscreen - heuristic",
      }
    case "recording-heuristic":
      // There is NO reliable browser signal that screen recording started. If
      // we ever suspect it from unrelated signals, we must still report it as
      // detectionMethod "unknown" rather than inventing a detection.
      return {
        eventType: "SCREEN_RECORDING",
        confidence: "unknown",
        detectionMethod: "unknown",
        note: "no reliable browser signal for screen recording - unknown by design",
      }
    default:
      return UNKNOWN
  }
}

/** Is this classification worth reporting to the backend? */
export function shouldReport(cl: Classification): boolean {
  // Only report signals that carry some signal weight. "unknown" confidence
  // with "unknown" detection carries no weight and shouldn't spam the server.
  if (cl.detectionMethod === "unknown" && cl.confidence === "unknown") return false
  return true
}
