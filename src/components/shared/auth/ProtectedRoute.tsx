import { Navigate, Outlet } from "react-router-dom"

import { useAuthStore } from "@/store/auth-store"

export function ProtectedRoute() {
  const { user, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { user, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
