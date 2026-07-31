import { Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"
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

export function AppLayout() {
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
          "flex flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900",
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

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-16 md:pb-0">
          <Outlet />
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
