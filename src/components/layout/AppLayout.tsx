import { Link, Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"
import { MailCheck } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useLayoutState } from "./useLayoutState"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarNav } from "./SidebarNav"
import { SidebarFooter } from "./SidebarFooter"
import { MobileSidebar } from "./MobileSidebar"
import { MobileDock } from "./MobileDock"
import { LogoutModal } from "./LogoutModal"
import { ScreenshotProtection } from "./ScreenshotProtection"
import { TopHeader } from "./TopHeader"

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const { user } = useAuthStore()
  const {
    mobileOpen,
    unreadCount,
    notificationCount,
    logoutModalOpen,
    loggingOut,
    isMinimized,
    isHidden,
    closeMobile,
    setMobileOpen,
    toggleSidebar,
    setLogoutModalOpen,
    handleLogoutConfirm,
  } = useLayoutState()

  const role = user?.role ?? "user"

  return (
    <div className="flex h-svh bg-gray-50 dark:bg-gray-950">
      <MobileSidebar
        mobileOpen={mobileOpen}
        isHidden={isHidden}
        closeMobile={closeMobile}
      />

      <aside
        className={cn(
          "flex h-svh flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900",
          !isHidden && "relative",
          isMinimized ? "w-16" : !isHidden ? "w-64" : "",
          isHidden &&
            cn(
              "fixed inset-y-0 left-0 z-50 pb-20",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )
        )}
      >
        <SidebarHeader isMinimized={isMinimized} closeMobile={closeMobile} />

        <SidebarNav
          isMinimized={isMinimized}
          closeMobile={closeMobile}
          unreadCount={unreadCount}
          notificationCount={notificationCount}
          role={role}
        />

        <SidebarFooter
          isMinimized={isMinimized}
          isHidden={isHidden}
          username={user?.username}
          onToggleSidebar={toggleSidebar}
          onLogoutClick={() => setLogoutModalOpen(true)}
        />
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        <TopHeader
          notificationCount={notificationCount}
          onOpenMenu={() => setMobileOpen(true)}
        />

        {user && !user.isAccountVerified && (
          <Link
            to="/verify-email"
            className="flex items-center justify-center gap-2 border-b border-amber-200/60 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/70"
          >
            <MailCheck className="size-3.5 shrink-0" />
            <span>
              Verify your email to activate your account enter the 6-digit code we sent you.
            </span>
          </Link>
        )}

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-16 md:pb-0">
          {children ?? <Outlet />}
        </main>
      </div>

      <MobileDock
        role={role}
        unreadCount={unreadCount}
        notificationCount={notificationCount}
        onOpenMenu={() => setMobileOpen(true)}
      />

      <LogoutModal
        open={logoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutModalOpen(false)}
        loading={loggingOut}
      />

      <ScreenshotProtection />
    </div>
  )
}
