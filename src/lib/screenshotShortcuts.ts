// Comprehensive screenshot-shortcut detection shared by all screenshot guards
// (global layout guard + per-view useScreenshotGuard). Keep in sync when the
// OS screenshot shortcuts change.

export function isScreenshotShortcut(e: KeyboardEvent): boolean {
  const k = e.key.toLowerCase()

  // PrintScreen (PrtScr) with ANY combination of modifiers - covers bare,
  // Alt+PrtScr (active window), Win/Super+PrintScreen, Win+Alt+PrtScr,
  // Win+Ctrl+PrtScr, and Shift/Ctrl variants across Windows/Linux. Some
  // platforms report the key as "PrintScreen" or "PrtScr".
  if (k === "printscreen" || k === "prtscr") return true

  // macOS full-screen / region / recording (Cmd+Shift+3/4/5) and Windows
  // Snip & Sketch region (Win+Shift+S). The OS meta key maps to e.metaKey.
  if (e.metaKey && e.shiftKey && (k === "s" || k === "3" || k === "4" || k === "5"))
    return true

  // macOS: Cmd+Ctrl+Shift+3/4 (screenshot to clipboard).
  if (e.ctrlKey && e.metaKey && e.shiftKey && (k === "3" || k === "4")) return true

  return false
}
