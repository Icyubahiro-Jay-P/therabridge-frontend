import { useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Extra classes for the centered panel; tailwind-merge resolves conflicts with the defaults. */
  panelClassName?: string
}

// Shared dialog shell. Closes on Escape and on mousedown directly on the
// backdrop (target === currentTarget), so a drag that starts inside the panel
// never dismisses it. Screens keep their own headers and close buttons.
export function Modal({ open, onClose, children, panelClassName }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900",
          panelClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
