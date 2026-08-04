import { useEffect, useState } from "react"
import { ShieldAlert } from "lucide-react"

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) {
      const s = JSON.parse(stored)
      return s[key] ?? fallback
    }
  } catch {}
  return fallback
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

export function ScreenshotProtection() {
  const [enabled, setEnabled] = useState(() => loadSetting("screenshotProtection", false))
  const [blurred, setBlurred] = useState(false)

  useEffect(() => {
    const onEvent = () => setEnabled(loadSetting("screenshotProtection", false))
    const interval = setInterval(onEvent, 1000)
    window.addEventListener("screenshot-protection-change", onEvent)
    window.addEventListener("storage", onEvent)
    return () => {
      clearInterval(interval)
      window.removeEventListener("screenshot-protection-change", onEvent)
      window.removeEventListener("storage", onEvent)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setBlurred(false)
      return
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isScreenshotShortcut(e)) {
        e.preventDefault()
        e.stopPropagation()
        setBlurred(true)
      }
    }

    function onVisibility() {
      setBlurred(document.hidden || document.visibilityState === "hidden")
    }

    window.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`fixed inset-0 z-[150] transition-opacity duration-200 ${
        blurred ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <ShieldAlert className="size-7" />
          </span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Screen protected
          </p>
          <p className="text-xs text-gray-400">
            Content is hidden while you're away
          </p>
        </div>
      </div>
    </div>
  )
}
