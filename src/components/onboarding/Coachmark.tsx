import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoachmarkProps {
  targetSelector: string
  title: string
  description: string
  placement?: "top" | "bottom" | "left" | "right"
  onDismiss: () => void
  onGotIt: () => void
}

interface Position {
  top: number
  left: number
  arrowTop: number
  arrowLeft: number
  placement: "top" | "bottom" | "left" | "right"
}

function computePosition(
  target: HTMLElement,
  placement: "top" | "bottom" | "left" | "right",
): Position {
  const rect = target.getBoundingClientRect()
  const gap = 12
  const arrowSize = 8

  switch (placement) {
    case "bottom":
      return {
        top: rect.bottom + gap,
        left: rect.left + rect.width / 2,
        arrowTop: -(arrowSize + 2),
        arrowLeft: 0,
        placement: "bottom",
      }
    case "top":
      return {
        top: rect.top - gap,
        left: rect.left + rect.width / 2,
        arrowTop: rect.height + gap - 2,
        arrowLeft: 0,
        placement: "top",
      }
    case "left":
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - gap,
        arrowTop: 0,
        arrowLeft: rect.width + gap - 2,
        placement: "left",
      }
    case "right":
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + gap,
        arrowTop: 0,
        arrowLeft: -(arrowSize + 2),
        placement: "right",
      }
  }
}

export function Coachmark({
  targetSelector,
  title,
  description,
  placement: preferredPlacement = "bottom",
  onDismiss,
  onGotIt,
}: CoachmarkProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<Position | null>(null)
  const [highlight, setHighlight] = useState<DOMRect | null>(null)

  useEffect(() => {
    const target = document.querySelector(targetSelector) as HTMLElement | null
    if (!target) {
      onDismiss()
      return
    }

    const update = () => {
      const computed = computePosition(target, preferredPlacement)
      setPos(computed)
      setHighlight(target.getBoundingClientRect())
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(target)
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [targetSelector, preferredPlacement, onDismiss])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onDismiss])

  if (!pos || !highlight) return null

  const tooltipTransform =
    pos.placement === "top" || pos.placement === "bottom"
      ? `translateX(-50%)`
      : `translateY(-50%)`

  const tooltipPosition =
    pos.placement === "top" || pos.placement === "bottom"
      ? { top: pos.placement === "bottom" ? pos.top : undefined, bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined, left: pos.left }
      : { top: pos.top, left: pos.placement === "right" ? pos.left : undefined, right: pos.placement === "left" ? window.innerWidth - pos.left : undefined }

  return (
    <>
      {/* Highlight ring */}
      <div
        className="pointer-events-none fixed z-9998 rounded-xl ring-2 ring-emerald-500/60 ring-offset-2 ring-offset-transparent transition-all duration-300"
        style={{
          top: highlight.top - 4,
          left: highlight.left - 4,
          width: highlight.width + 8,
          height: highlight.height + 8,
        }}
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9997 bg-black/20"
        onClick={onDismiss}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        role="tooltip"
        className={cn(
          "fixed z-9999 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900",
          "animate-in fade-in-0 zoom-in-95",
        )}
        style={{
          ...tooltipPosition,
          transform: tooltipTransform,
        }}
      >
        {/* Arrow */}
        <div
          className="absolute h-2 w-2 rotate-45 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
          style={{
            top: pos.placement === "bottom" ? -5 : undefined,
            bottom: pos.placement === "top" ? -5 : undefined,
            left: pos.placement === "left" ? undefined : pos.placement === "right" ? -5 : "calc(50% - 5px)",
            right: pos.placement === "right" ? undefined : pos.placement === "left" ? -5 : "calc(50% - 5px)",
          }}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="mt-0.5 shrink-0 rounded-md p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Dismiss tip"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onDismiss}
            className="text-[11px] text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            Don&apos;t show again
          </button>
          <button
            type="button"
            onClick={onGotIt}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  )
}
