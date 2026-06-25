import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { GuestRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { useAuthStore } from "@/store/auth-store"
import { Leaf } from "lucide-react"

import { LoginPage } from "@/pages/LoginPage"
import { SignupPage } from "@/pages/SignupPage"
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/ResetPasswordPage"
import { PublicProfilePage } from "@/pages/PublicProfilePage"

import { HomePage as UserHomePage } from "@/pages/user/HomePage"
import { ChatPage as UserChatPage } from "@/pages/user/ChatPage"
import { CommunityPage as UserCommunityPage } from "@/pages/user/CommunityPage"
import { TherapistsPage as UserTherapistsPage } from "@/pages/user/TherapistsPage"
import { SettingsPage as UserSettingsPage } from "@/pages/user/SettingsPage"
import { ProfilePage as UserProfilePage } from "@/pages/user/ProfilePage"

import { AdminDashboardPage } from "@/pages/admin/DashboardPage"
import { AdminUsersPage } from "@/pages/admin/UsersPage"
import { AdminCommunitiesPage } from "@/pages/admin/CommunitiesPage"

import { TherapistDashboardPage } from "@/pages/therapist/DashboardPage"
import { TherapistClientsPage } from "@/pages/therapist/ClientsPage"

function RoleRoute({
  userPage: UserPage,
  adminPage: AdminPage,
  therapistPage: TherapistPage,
}: {
  userPage: React.ComponentType
  adminPage?: React.ComponentType
  therapistPage?: React.ComponentType
}) {
  const user = useAuthStore((state) => state.user)
  const role = user?.role ?? "user"

  if (role === "admin" && AdminPage) return <AdminPage />
  if (role === "therapist" && TherapistPage) return <TherapistPage />
  return <UserPage />
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-flex size-12 animate-pulse items-center justify-center rounded-xl bg-emerald-600">
            <Leaf />
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading Therabridge...
          </p>
        </div>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={
                  <RoleRoute
                    userPage={UserHomePage}
                    adminPage={AdminDashboardPage}
                    therapistPage={TherapistDashboardPage}
                  />
                }
              />
              <Route path="/chat" element={<UserChatPage />} />
              <Route path="/chat/:username" element={<UserChatPage />} />
              <Route path="/community" element={<UserCommunityPage />} />
              <Route path="/community/:inviteKey" element={<UserCommunityPage />} />
              <Route path="/therapists" element={<UserTherapistsPage />} />
              <Route path="/settings" element={<UserSettingsPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/clients" element={<TherapistClientsPage />} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/communities" element={<AdminCommunitiesPage />} />
            </Route>
          </Route>

          <Route path="/user/:username" element={<PublicProfilePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  )
}

export default App
