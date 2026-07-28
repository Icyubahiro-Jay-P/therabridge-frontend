import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { GuestRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { useAuthStore } from "@/store/auth-store"
import { api } from "@/lib/api"
import { Leaf } from "lucide-react"

const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((mod) => ({ default: mod.LoginPage }))
)
const SignupPage = lazy(() =>
  import("@/pages/SignupPage").then((mod) => ({ default: mod.SignupPage }))
)
const ForgotPasswordPage = lazy(() =>
  import("@/pages/ForgotPasswordPage").then((mod) => ({
    default: mod.ForgotPasswordPage,
  }))
)
const ResetPasswordPage = lazy(() =>
  import("@/pages/ResetPasswordPage").then((mod) => ({
    default: mod.ResetPasswordPage,
  }))
)
const PublicProfilePage = lazy(() =>
  import("@/pages/PublicProfilePage").then((mod) => ({
    default: mod.PublicProfilePage,
  }))
)
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((mod) => ({ default: mod.NotFoundPage }))
)

const UserHomePage = lazy(() =>
  import("@/pages/user/HomePage").then((mod) => ({ default: mod.HomePage }))
)
const UserChatPage = lazy(() =>
  import("@/pages/user/ChatPage").then((mod) => ({ default: mod.ChatPage }))
)
const UserCommunityPage = lazy(() =>
  import("@/pages/user/CommunityPage").then((mod) => ({
    default: mod.CommunityPage,
  }))
)
const UserTherapistsPage = lazy(() =>
  import("@/pages/user/TherapistsPage").then((mod) => ({
    default: mod.TherapistsPage,
  }))
)
const UserSettingsPage = lazy(() =>
  import("@/pages/user/SettingsPage").then((mod) => ({
    default: mod.SettingsPage,
  }))
)
const UserProfilePage = lazy(() =>
  import("@/pages/user/ProfilePage").then((mod) => ({
    default: mod.ProfilePage,
  }))
)
const UserTherryPage = lazy(() =>
  import("@/pages/user/TherryPage").then((mod) => ({ default: mod.TherryPage }))
)
const UserNotificationsPage = lazy(() =>
  import("@/pages/user/NotificationsPage").then((mod) => ({
    default: mod.NotificationsPage,
  }))
)
const UserMoodPage = lazy(() =>
  import("@/pages/user/MoodPage").then((mod) => ({ default: mod.MoodPage }))
)
const UserCrisisPage = lazy(() =>
  import("@/pages/user/CrisisPage").then((mod) => ({ default: mod.CrisisPage }))
)

const AdminDashboardPage = lazy(() =>
  import("@/pages/admin/DashboardPage").then((mod) => ({
    default: mod.AdminDashboardPage,
  }))
)
const AdminUsersPage = lazy(() =>
  import("@/pages/admin/UsersPage").then((mod) => ({
    default: mod.AdminUsersPage,
  }))
)
const AdminCommunitiesPage = lazy(() =>
  import("@/pages/admin/CommunitiesPage").then((mod) => ({
    default: mod.AdminCommunitiesPage,
  }))
)

const TherapistDashboardPage = lazy(() =>
  import("@/pages/therapist/DashboardPage").then((mod) => ({
    default: mod.TherapistDashboardPage,
  }))
)
const TherapistClientsPage = lazy(() =>
  import("@/pages/therapist/ClientsPage").then((mod) => ({
    default: mod.TherapistClientsPage,
  }))
)

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

  useEffect(() => {
    async function trackLogin() {
      try {
        await api.post("/api/users/login-streak")
      } catch {}
    }
    if (isInitialized) {
      void trackLogin()
    }
  }, [isInitialized])

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

const PageFallback = () => (
  <div className="flex min-h-svh items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-200">
    Loading content...
  </div>
)

export function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />

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
                <Route
                  path="/community/:inviteKey"
                  element={<UserCommunityPage />}
                />
                <Route path="/therapists" element={<UserTherapistsPage />} />
                <Route path="/settings" element={<UserSettingsPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/therry" element={<UserTherryPage />} />
                <Route
                  path="/notifications"
                  element={<UserNotificationsPage />}
                />
                <Route path="/mood" element={<UserMoodPage />} />
                <Route path="/crisis" element={<UserCrisisPage />} />
                <Route path="/clients" element={<TherapistClientsPage />} />
                <Route path="/users" element={<AdminUsersPage />} />
                <Route path="/communities" element={<AdminCommunitiesPage />} />
              </Route>
            </Route>

            <Route path="/user/:username" element={<PublicProfilePage />} />

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthInitializer>
    </BrowserRouter>
  )
}

export default App
