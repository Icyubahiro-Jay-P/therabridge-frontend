import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  href,
  color,
  isAlert,
}: {
  label: string
  value: number
  icon: LucideIcon
  href: string
  color: string
  isAlert?: boolean
}) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900",
        isAlert && value > 0 && "border-red-200 dark:border-red-900/50"
      )}
    >
      <span className={cn("flex size-12 items-center justify-center rounded-xl text-white", color)}>
        <Icon className="size-6" />
      </span>
      <div>
        <p className={cn("text-2xl font-bold", isAlert && value > 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white")}>
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <ChevronRight className="ml-auto size-4 text-gray-300" />
    </Link>
  )
}
