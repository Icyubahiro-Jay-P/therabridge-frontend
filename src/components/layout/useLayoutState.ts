import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { getSocket } from "@/lib/socket"
import type { SidebarMode } from "./types"

export function useLayoutState() {
  const { user, logout } = useAuthStore()
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("full")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const role = user?.role ?? "user"
  const isMinimized = sidebarMode === "minimized"
  const isHidden = sidebarMode === "hidden"

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
    let mounted = true

    async function refresh() {
      try {
        const [chatRes, notifRes] = await Promise.all([
          api.get<{ data: { unread: number }[] }>("/api/chat/conversations"),
          api
            .get("/api/notifications/unread-count")
            .catch(() => ({ data: { count: 0 } })),
        ])
        if (!mounted) return
        const convs = chatRes.data.data
        const total = convs.reduce((sum, c) => sum + (c.unread ?? 0), 0)
        setUnreadCount(total)
        setNotificationCount(notifRes.data.count ?? 0)
      } catch {}
    }
    void refresh()

    const socket = getSocket()
    if (!socket) return

    function onConversationsUpdated() {
      void refresh()
    }
    function onNotification() {
      void refresh()
    }

    socket.on("conversations_updated", onConversationsUpdated)
    socket.on("notification", onNotification)
    return () => {
      mounted = false
      socket.off("conversations_updated", onConversationsUpdated)
      socket.off("notification", onNotification)
    }
  }, [])

  function closeMobile() {
    setMobileOpen(false)
  }

  function toggleSidebar() {
    setSidebarMode(isMinimized ? "full" : "minimized")
  }

  async function handleLogoutConfirm() {
    setLoggingOut(true)
    try {
      await logout()
    } catch {
    } finally {
      setLoggingOut(false)
      setLogoutModalOpen(false)
    }
  }

  return {
    user,
    role,
    sidebarMode,
    setSidebarMode,
    mobileOpen,
    setMobileOpen,
    unreadCount,
    notificationCount,
    logoutModalOpen,
    setLogoutModalOpen,
    loggingOut,
    isMinimized,
    isHidden,
    closeMobile,
    toggleSidebar,
    handleLogoutConfirm,
  }
}
