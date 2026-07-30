import React from "react"
import type { ReactNode } from "react"

interface TooltipProps {
  content: string | ReactNode
  children: ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

/**
 * Tooltip Component
 * Shows a helpful label when hovering over an element
 */
export function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
    right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
  }

  const arrowClasses = {
    top: "top-full border-t border-l border-gray-800 dark:border-gray-200",
    bottom:
      "bottom-full border-b border-l border-gray-800 dark:border-gray-200",
    left: "left-full border-l border-t border-gray-800 dark:border-gray-200",
    right: "right-full border-r border-t border-gray-800 dark:border-gray-200",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-lg dark:bg-gray-200 dark:text-gray-800 ${positionClasses[position]} whitespace-nowrap`}
        >
          {content}
          <div
            className={`absolute h-0 w-0 border-4 border-transparent ${arrowClasses[position]}`}
          ></div>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Icon with tooltip
 */
export function TooltipIcon({ icon: Icon, tooltip, ...props }: any) {
  return (
    <Tooltip content={tooltip}>
      <Icon {...props} />
    </Tooltip>
  )
}
