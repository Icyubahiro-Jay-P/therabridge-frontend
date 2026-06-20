import { Link, NavLink, Outlet } from "react-router-dom"
import { Home, Leaf, LogOut, MessageCircle, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
    isActive
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
  )

export function AppLayout() {
  const { user, logout } = useAuthStore()

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // Cookie may already be cleared; still redirect via route guard.
    }
  }

  return (
    <div className="min-h-svh bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/80 backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-bold text-gray-900 dark:text-white"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 shadow-sm">
              <Leaf className="size-4 text-white" />
            </span>
            Therabridge
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <Home className="size-4" />
              Home
            </NavLink>
            <NavLink to="/chat" className={navLinkClass}>
              <MessageCircle className="size-4" />
              Chat
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              <User className="size-4" />
              Profile
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-gray-500 sm:inline dark:text-gray-400">
              {user?.firstName}
            </span>
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            >
              <LogOut className="size-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
