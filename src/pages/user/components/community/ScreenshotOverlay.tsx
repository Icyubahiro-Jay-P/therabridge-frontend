import { useEffect, useRef } from "react"

export function ScreenshotOverlay({
  screenshotProtected,
  active,
}: {
  screenshotProtected: boolean
  active: unknown
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!screenshotProtected) return
    function handleVisibility() {
      if (document.hidden && overlayRef.current) {
        overlayRef.current.classList.remove("hidden")
      } else if (overlayRef.current) {
        overlayRef.current.classList.add("hidden")
      }
    }
    function handleContextMenu(e: MouseEvent) {
      if (active) e.preventDefault()
    }
    document.addEventListener("visibilitychange", handleVisibility)
    document.addEventListener("contextmenu", handleContextMenu)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [screenshotProtected, active])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 hidden bg-black"
    />
  )
}
