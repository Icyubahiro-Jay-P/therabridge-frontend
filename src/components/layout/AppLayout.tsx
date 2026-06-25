import { type ReactNode, useEffect, useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"
import {
  Home,
  Leaf,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

type SidebarMode = "full" | "minimized" | "hidden"

function NavItem({
  to,
  icon,
  label,
  minimized,
  end,
  onClick,
}: {
  to: string
  icon: ReactNode
  label: string
  minimized: boolean
  end?: boolean
  onClick?: () => void
}) {
  const baseClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
      minimized ? "justify-center px-2.5" : "gap-3",
      isActive
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    )

  return (
    <NavLink to={to} end={end} className={baseClass} onClick={onClick}>
      {icon}
      {!minimized && <span>{label}</span>}
    </NavLink>
  )
}

export function AppLayout() {
  const { user, logout } = useAuthStore()
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("full")
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-switch to hidden on mobile, restore on desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSidebarMode("hidden")
      } else {
        setSidebarMode((prev) => (prev === "hidden" ? "full" : prev))
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reset mobile overlay when coming out of hidden mode
  useEffect(() => {
    if (sidebarMode !== "hidden") setMobileOpen(false)
  }, [sidebarMode])

  const isMinimized = sidebarMode === "minimized"
  const isHidden = sidebarMode === "hidden"

  function closeMobile() {
    setMobileOpen(false)
  }

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // Cookie may already be cleared; still redirect via route guard.
    }
  }

  return (
    <div className="flex h-svh bg-gray-50 dark:bg-gray-950">
      {/* Overlay for hidden/mobile mode */}
      {isHidden && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900",
          !isHidden && "relative",
          isMinimized ? "w-16" : !isHidden ? "w-64" : "",
          isHidden &&
            cn(
              "fixed inset-y-0 left-0 z-50",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )
        )}
      >
        {/* Brand */}
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

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <NavItem
            to="/"
            icon={<Home className="size-4" />}
            label="Home"
            minimized={isMinimized}
            end
            onClick={closeMobile}
          />
          <NavItem
            to="/chat"
            icon={<MessageCircle className="size-4" />}
            label="Chat"
            minimized={isMinimized}
            onClick={closeMobile}
          />
          <NavItem
            to="/community"
            icon={<Users className="size-4" />}
            label="Community"
            minimized={isMinimized}
            onClick={closeMobile}
          />
          <NavItem
            to="/profile"
            icon={<User className="size-4" />}
            label="Profile"
            minimized={isMinimized}
            onClick={closeMobile}
          />
        </nav>

        {/* Bottom section */}
        <div
          className={cn(
            "border-t border-gray-200 dark:border-gray-800",
            isMinimized ? "space-y-2 p-2" : "p-3"
          )}
        >
          {/* Toggle mode (desktop only) */}
          {!isHidden && (
            <button
              onClick={() =>
                setSidebarMode(isMinimized ? "full" : "minimized")
              }
              className={cn(
                "flex w-8 items-center rounded-lg cursor-pointer p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                isMinimized ? "justify-center" : "gap-2"
              )}
              title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              {isMinimized ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>
          )}

          {/* User + theme */}
          {!isMinimized && (
            <div className="flex items-center justify-between gap-2 px-1 mb-1">
              <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                {user?.firstName}
              </span>
              <ModeToggle />
            </div>
          )}
          {isMinimized && (
            <div className="flex justify-center">
              <ModeToggle />
            </div>
          )}

          {/* Logout */}
          <Button
            variant="outline"
            size={isMinimized ? "icon" : "sm"}
            onClick={handleLogout}
            className={cn(
              "border-gray-200 cursor-pointer text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400",
              isMinimized ? "w-full" : "w-full gap-1.5"
            )}
          >
            <LogOut className="size-3.5" />
            {!isMinimized && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Floating toggle for hidden/mobile mode */}
      {isHidden && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-4 left-4 z-50 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
        >
          <Menu className="size-5" />
        </button>
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
