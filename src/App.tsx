import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { GuestRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AppLayout, AuthLayout } from "@/components/layout/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { SignupPage } from "@/pages/SignupPage"
import { useAuthStore } from "@/store/auth-store"

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading Therabridge...</p>
      </div>
    )
  }

  return children
}

export function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  )
}

export default App
