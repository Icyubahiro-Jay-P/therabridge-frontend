import { NavLink } from "react-router-dom"
import { Home, LayoutDashboard, MessageCircle, Users, UserCheck, Bell, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

function dockLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150",
    isActive
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
  )
}

export function MobileDock({
  role,
  unreadCount,
  notificationCount,
  onOpenMenu,
}: {
  role: string
  unreadCount: number
  notificationCount: number
  onOpenMenu: () => void
}) {
  const isAdmin = role === "admin"
  const isTherapist = role === "therapist"

  const homePath = role === "user" ? "/" : "/dashboard"
  const HomeIcon = role === "user" ? Home : LayoutDashboard

  const thirdItem = isAdmin
    ? { to: "/users", icon: <Users className="size-4" />, label: "Users" }
    : isTherapist
      ? { to: "/clients", icon: <UserCheck className="size-4" />, label: "Clients" }
      : { to: "/community", icon: <Users className="size-4" />, label: "Community" }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200/70 bg-white/95 px-1 py-1 shadow-[0_-1px_20px_rgba(15,23,42,0.08)] backdrop-blur md:hidden dark:border-gray-800/80 dark:bg-gray-950/90">
      <div className="grid grid-cols-5 gap-1">
        <NavLink to={homePath} end className={dockLinkClass}>
          <HomeIcon className="size-4" />
        </NavLink>
        <NavLink to="/chat" className={dockLinkClass}>
          <div className="relative">
            <MessageCircle className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-emerald-600 px-0.5 text-[8px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </NavLink>
        <NavLink to={thirdItem.to} className={dockLinkClass}>
          {thirdItem.icon}
        </NavLink>
        <NavLink to="/notifications" className={dockLinkClass}>
          <div className="relative">
            <Bell className="size-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-semibold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </div>
        </NavLink>
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-9 w-full items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </button>
      </div>
    </div>
  )
}
