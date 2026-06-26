import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarHeader({
  isMinimized,
  closeMobile,
}: {
  isMinimized: boolean
  closeMobile: () => void
}) {
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-800",
        isMinimized ? "justify-center" : "px-5"
      )}
    >
      <Link
        to="/"
        onClick={closeMobile}
        className={cn(
          "inline-flex items-center font-bold text-gray-900 dark:text-white",
          isMinimized ? "" : "gap-2.5"
        )}
      >
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 shadow-sm">
          <Leaf className="size-4 text-white" />
        </span>
        {!isMinimized && "Therabridge"}
      </Link>
    </div>
  )
}
