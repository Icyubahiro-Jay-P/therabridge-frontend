import { type ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

function baseClass(minimized: boolean) {
  return ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
      minimized ? "justify-center px-2.5" : "gap-3",
      isActive
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    )
}

export function NavItem({
  to, icon, label, minimized, end, onClick,
}: {
  to: string
  icon: ReactNode
  label: string
  minimized: boolean
  end?: boolean
  onClick?: () => void
}) {
  return (
    <NavLink to={to} end={end} className={baseClass(minimized)} onClick={onClick}>
      {icon}
      {!minimized && <span>{label}</span>}
    </NavLink>
  )
}

export function NavItemWithBadge({
  to, icon, label, minimized, badge, onClick,
}: {
  to: string
  icon: ReactNode
  label: string
  minimized: boolean
  badge?: number
  onClick?: () => void
}) {
  return (
    <NavLink to={to} className={baseClass(minimized)} onClick={onClick}>
      <div className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 py-0.5 text-[10px] leading-none font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      {!minimized && <span>{label}</span>}
    </NavLink>
  )
}
