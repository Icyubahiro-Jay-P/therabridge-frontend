import { Link, NavLink, Outlet } from "react-router-dom"
import { Home, Leaf, LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex items-center gap-2 rounded-4xl px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 font-medium">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Leaf className="size-4" />
            </span>
            Therabridge
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <Home className="size-4" />
              Home
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              <User className="size-4" />
              Profile
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.firstName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-emerald-50 via-background to-background px-4 py-10 dark:from-emerald-950/20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-medium">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Leaf className="size-5" />
            </span>
            Therabridge
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Your mental wellness companion
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
