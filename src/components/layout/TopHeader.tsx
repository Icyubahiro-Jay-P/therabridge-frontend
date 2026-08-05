import { Link, NavLink, useLocation } from "react-router-dom"
import { Bell, Menu } from "lucide-react"

import { useAuthStore } from "@/store/auth-store"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Avatar } from "@/components/user/shared/Avatar"

function getPageTitle(pathname: string, role: string): string {
  if (pathname === "/") return role === "user" ? "Home" : "Dashboard"
  if (pathname.startsWith("/chat")) return "Chat"
  if (pathname.startsWith("/community")) return "Community"
  if (pathname.startsWith("/mood")) return "Mood"
  if (pathname.startsWith("/therapists")) return "Therapists"
  if (pathname.startsWith("/settings")) return "Settings"
  if (pathname.startsWith("/profile")) return "Profile"
  if (pathname.startsWith("/notifications")) return "Notifications"
  if (pathname.startsWith("/crisis")) return "Crisis Support"
  if (pathname.startsWith("/safety-plan")) return "Safety Plan"
  if (pathname.startsWith("/clients")) return "Clients"
  if (pathname.startsWith("/users")) return "Users"
  if (pathname.startsWith("/communities")) return "Communities"
  return "Therabridge"
}

export function TopHeader({
  notificationCount,
  onOpenMenu,
}: {
  notificationCount: number
  onOpenMenu: () => void
}) {
  const { user } = useAuthStore()
  const { pathname } = useLocation()
  const role = user?.role ?? "user"

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 md:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
          {getPageTitle(pathname, role)}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <NavLink
          to="/notifications"
          className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </NavLink>
        <ModeToggle />
        <Link
          to="/profile"
          className="ml-1 inline-flex shrink-0 items-center gap-2 rounded-full py-1 pr-1 pl-1 sm:pr-3"
          title="View profile"
        >
          {user && (
            <Avatar
              user={{
                _id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
              }}
              size="sm"
              fallbackClassName="bg-linear-to-br from-emerald-500 to-teal-600"
            />
          )}
          <span className="hidden max-w-28 truncate text-sm font-medium text-gray-700 sm:block dark:text-gray-200">
            {user?.firstName}
          </span>
        </Link>
      </div>
    </header>
  )
}
