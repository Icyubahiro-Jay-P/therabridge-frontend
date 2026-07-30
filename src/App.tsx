import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { GuestRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { useAuthStore } from "@/store/auth-store"
import { ErrorBoundary } from "@/components/auth/ErrorBoundary"
import { Skeleton } from "@/components/ui/skeleton"
import { Leaf } from "lucide-react"

const LoginPage = lazy(() => import("@/pages/LoginPage").then((mod) => ({ default: mod.LoginPage })))
const SignupPage = lazy(() => import("@/pages/SignupPage").then((mod) => ({ default: mod.SignupPage })))
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage").then((mod) => ({ default: mod.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage").then((mod) => ({ default: mod.ResetPasswordPage })))
const PublicProfilePage = lazy(() => import("@/pages/PublicProfilePage").then((mod) => ({ default: mod.PublicProfilePage })))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((mod) => ({ default: mod.NotFoundPage })))

const UserHomePage = lazy(() => import("@/pages/user/HomePage").then((mod) => ({ default: mod.HomePage })))
const UserChatPage = lazy(() => import("@/pages/user/ChatPage").then((mod) => ({ default: mod.ChatPage })))
const UserCommunityPage = lazy(() => import("@/pages/user/CommunityPage").then((mod) => ({ default: mod.CommunityPage })))
const UserTherapistsPage = lazy(() => import("@/pages/user/TherapistsPage").then((mod) => ({ default: mod.TherapistsPage })))
const UserSettingsPage = lazy(() => import("@/pages/user/SettingsPage").then((mod) => ({ default: mod.SettingsPage })))
const UserProfilePage = lazy(() => import("@/pages/user/ProfilePage").then((mod) => ({ default: mod.ProfilePage })))
const UserTherryPage = lazy(() => import("@/pages/user/TherryPage").then((mod) => ({ default: mod.TherryPage })))
const UserNotificationsPage = lazy(() => import("@/pages/user/NotificationsPage").then((mod) => ({ default: mod.NotificationsPage })))
const UserMoodPage = lazy(() => import("@/pages/user/MoodPage").then((mod) => ({ default: mod.MoodPage })))
const UserCrisisPage = lazy(() => import("@/pages/user/CrisisPage").then((mod) => ({ default: mod.CrisisPage })))

const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage").then((mod) => ({ default: mod.AdminDashboardPage })))
const AdminUsersPage = lazy(() => import("@/pages/admin/UsersPage").then((mod) => ({ default: mod.AdminUsersPage })))
const AdminCommunitiesPage = lazy(() => import("@/pages/admin/CommunitiesPage").then((mod) => ({ default: mod.AdminCommunitiesPage })))

const TherapistDashboardPage = lazy(() => import("@/pages/therapist/DashboardPage").then((mod) => ({ default: mod.TherapistDashboardPage })))
const TherapistClientsPage = lazy(() => import("@/pages/therapist/ClientsPage").then((mod) => ({ default: mod.TherapistClientsPage })))

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

  if (!isInitialized) {
    void initialize()
    return (
      <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-flex size-12 animate-pulse items-center justify-center rounded-xl bg-emerald-600">
            <Leaf />
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading Therabridge...</p>
        </div>
      </div>
    )
  }

  return children
}

function PageSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function RouteErrorFallback({ retry }: { error: Error | null; retry: () => void }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-gray-500">This section encountered an error. Please try again.</p>
        <button onClick={retry} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Retry
        </button>
      </div>
    </div>
  )
}

const suspenseFallback = <PageSkeleton />

function ErrorBoundaryRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={(error, retry) => <RouteErrorFallback error={error} retry={retry} />}>
      <Suspense fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<ErrorBoundaryRoute><LoginPage /></ErrorBoundaryRoute>} />
            <Route path="/signup" element={<ErrorBoundaryRoute><SignupPage /></ErrorBoundaryRoute>} />
          </Route>

          <Route path="/forgot-password" element={<ErrorBoundaryRoute><ForgotPasswordPage /></ErrorBoundaryRoute>} />
          <Route path="/reset-password/:token" element={<ErrorBoundaryRoute><ResetPasswordPage /></ErrorBoundaryRoute>} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={
                  <ErrorBoundaryRoute>
                    <RoleRoute
                      userPage={UserHomePage}
                      adminPage={AdminDashboardPage}
                      therapistPage={TherapistDashboardPage}
                    />
                  </ErrorBoundaryRoute>
                }
              />
              <Route path="/chat" element={<ErrorBoundaryRoute><UserChatPage /></ErrorBoundaryRoute>} />
              <Route path="/chat/:username" element={<ErrorBoundaryRoute><UserChatPage /></ErrorBoundaryRoute>} />
              <Route path="/community" element={<ErrorBoundaryRoute><UserCommunityPage /></ErrorBoundaryRoute>} />
              <Route path="/community/:inviteKey" element={<ErrorBoundaryRoute><UserCommunityPage /></ErrorBoundaryRoute>} />
              <Route path="/therapists" element={<ErrorBoundaryRoute><UserTherapistsPage /></ErrorBoundaryRoute>} />
              <Route path="/settings" element={<ErrorBoundaryRoute><UserSettingsPage /></ErrorBoundaryRoute>} />
              <Route path="/profile" element={<ErrorBoundaryRoute><UserProfilePage /></ErrorBoundaryRoute>} />
              <Route path="/therry" element={<ErrorBoundaryRoute><UserTherryPage /></ErrorBoundaryRoute>} />
              <Route path="/notifications" element={<ErrorBoundaryRoute><UserNotificationsPage /></ErrorBoundaryRoute>} />
              <Route path="/mood" element={<ErrorBoundaryRoute><UserMoodPage /></ErrorBoundaryRoute>} />
              <Route path="/crisis" element={<ErrorBoundaryRoute><UserCrisisPage /></ErrorBoundaryRoute>} />
              <Route path="/clients" element={<ErrorBoundaryRoute><TherapistClientsPage /></ErrorBoundaryRoute>} />
              <Route path="/users" element={<ErrorBoundaryRoute><AdminUsersPage /></ErrorBoundaryRoute>} />
              <Route path="/communities" element={<ErrorBoundaryRoute><AdminCommunitiesPage /></ErrorBoundaryRoute>} />
            </Route>
          </Route>

          <Route path="/user/:username" element={<ErrorBoundaryRoute><PublicProfilePage /></ErrorBoundaryRoute>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  )
}

export default App
