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
  Settings,
  Stethoscope,
  User,
  Users,
  LayoutDashboard,
  Shield,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
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

function NavItemWithBadge({
  to,
  icon,
  label,
  minimized,
  badge,
  onClick,
}: {
  to: string
  icon: ReactNode
  label: string
  minimized: boolean
  badge?: number
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
    <NavLink to={to} className={baseClass} onClick={onClick}>
      <div className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white leading-none py-0.5">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      {!minimized && <span>{label}</span>}
    </NavLink>
  )
}

function LogoutModal({
  open,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <LogOut className="size-6 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Log out?</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to log out? You'll need to sign in again to access your account.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading} className="flex-1">Cancel</Button>
          <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
            {loading ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AppLayout() {
  const { user, logout } = useAuthStore()
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("full")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const role = user?.role ?? "user"

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

  useEffect(() => {
    if (sidebarMode !== "hidden") setMobileOpen(false)
  }, [sidebarMode])

  useEffect(() => {
    async function poll() {
      try {
        const resp = await api.get("/api/chat/conversations")
        const convs: { unread: number }[] = resp.data
        const total = convs.reduce((sum, c) => sum + (c.unread ?? 0), 0)
        setUnreadCount(total)
      } catch {}
    }
    void poll()
    const interval = setInterval(poll, 10000)
    return () => clearInterval(interval)
  }, [])

  const isMinimized = sidebarMode === "minimized"
  const isHidden = sidebarMode === "hidden"

  function closeMobile() { setMobileOpen(false) }

  async function handleLogoutConfirm() {
    setLoggingOut(true)
    try {
      await logout()
    } catch {}
    finally { setLoggingOut(false); setLogoutModalOpen(false) }
  }

  return (
    <div className="flex h-svh bg-gray-50 dark:bg-gray-950">
      {isHidden && mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={closeMobile} />
      )}

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

        <nav className="flex flex-col gap-1 p-3 flex-1">
          <NavItem
            to="/"
            icon={role === "user" ? <Home className="size-4" /> : <LayoutDashboard className="size-4" />}
            label={role === "user" ? "Home" : "Dashboard"}
            minimized={isMinimized}
            end
            onClick={closeMobile}
          />
          <NavItemWithBadge
            to="/chat"
            icon={<MessageCircle className="size-4" />}
            label="Chat"
            minimized={isMinimized}
            badge={unreadCount}
            onClick={closeMobile}
          />
          <NavItem
            to="/community"
            icon={<Users className="size-4" />}
            label="Community"
            minimized={isMinimized}
            onClick={closeMobile}
          />
          {role === "user" && (
            <NavItem
              to="/therapists"
              icon={<Stethoscope className="size-4" />}
              label="Therapists"
              minimized={isMinimized}
              onClick={closeMobile}
            />
          )}
          {role === "therapist" && (
            <NavItem
              to="/clients"
              icon={<User className="size-4" />}
              label="Clients"
              minimized={isMinimized}
              onClick={closeMobile}
            />
          )}
          {role === "admin" && (
            <>
              <NavItem
                to="/users"
                icon={<User className="size-4" />}
                label="Users"
                minimized={isMinimized}
                onClick={closeMobile}
              />
              <NavItem
                to="/communities"
                icon={<Shield className="size-4" />}
                label="Communities"
                minimized={isMinimized}
                onClick={closeMobile}
              />
            </>
          )}
          <div className="mt-auto" />
          <NavItem
            to="/settings"
            icon={<Settings className="size-4" />}
            label="Settings"
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

        <div
          className={cn(
            "border-t border-gray-200 dark:border-gray-800",
            isMinimized ? "space-y-2 p-2" : "p-3"
          )}
        >
          {!isHidden && (
            <button
              onClick={() => setSidebarMode(isMinimized ? "full" : "minimized")}
              className={cn(
                "flex w-8 items-center rounded-lg cursor-pointer p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                isMinimized ? "justify-center" : "gap-2"
              )}
              title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              {isMinimized ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          )}

          {!isMinimized && (
            <div className="flex items-center justify-between gap-2 px-1 mb-1">
              <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                @{user?.username}
              </span>
              <ModeToggle />
            </div>
          )}
          {isMinimized && (
            <div className="flex justify-center">
              <ModeToggle />
            </div>
          )}

          <Button
            variant="outline"
            size={isMinimized ? "icon" : "sm"}
            onClick={() => setLogoutModalOpen(true)}
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

      {isHidden && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-4 left-4 z-50 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
        >
          <Menu className="size-5" />
        </button>
      )}

      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>

      <LogoutModal
        open={logoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutModalOpen(false)}
        loading={loggingOut}
      />
    </div>
  )
}
