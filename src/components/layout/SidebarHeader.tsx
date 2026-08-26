import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"

export function SidebarHeader({
  isMinimized,
  closeMobile,
}: {
  isMinimized: boolean
  closeMobile: () => void
}) {
  return (
    <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-5 dark:border-gray-800">
      <Link
        to="/"
        onClick={closeMobile}
        className="inline-flex items-center gap-2.5 font-bold text-gray-900 dark:text-white"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 shadow-sm">
          <Leaf className="size-4 text-white" />
        </span>
        {!isMinimized && "Therabridge"}
      </Link>
    </div>
  )
}
