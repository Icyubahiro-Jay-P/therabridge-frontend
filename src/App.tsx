import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { GuestRoute, ProtectedRoute } from "@/components/shared/auth/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { useAuthStore } from "@/store/auth-store"
import { ErrorBoundary } from "@/components/shared/auth/ErrorBoundary"
import { Skeleton } from "@/components/ui/skeleton"
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
const VerifyEmailPage = lazy(() =>
  import("@/pages/VerifyEmailPage").then((mod) => ({
    default: mod.VerifyEmailPage,
  }))
)
const VerifyTwoFactorPage = lazy(() =>
  import("@/pages/VerifyTwoFactorPage").then((mod) => ({
    default: mod.VerifyTwoFactorPage,
  }))
)
const OnboardingPage = lazy(() =>
  import("@/pages/OnboardingPage").then((mod) => ({
    default: mod.OnboardingPage,
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
const AccountDisabledPage = lazy(() =>
  import("@/pages/AccountDisabledPage").then((mod) => ({
    default: mod.AccountDisabledPage,
  }))
)
const LandingPage = lazy(() =>
  import("@/pages/LandingPage").then((mod) => ({ default: mod.LandingPage }))
)
const TermsPage = lazy(() =>
  import("@/pages/TermsPage").then((mod) => ({ default: mod.TermsPage }))
)
const PrivacyPage = lazy(() =>
  import("@/pages/PrivacyPage").then((mod) => ({ default: mod.PrivacyPage }))
)
const CookiesPage = lazy(() =>
  import("@/pages/CookiesPage").then((mod) => ({ default: mod.CookiesPage }))
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
const UserSafetyPlanPage = lazy(() =>
  import("@/pages/user/SafetyPlanPage").then((mod) => ({ default: mod.SafetyPlanPage }))
)
const UserJournalPage = lazy(() =>
  import("@/components/user/journal/JournalPage").then((mod) => ({ default: mod.JournalPage }))
)
const UserThoughtRecordsPage = lazy(() =>
  import("@/components/user/thought-records/ThoughtRecordsPage").then((mod) => ({ default: mod.ThoughtRecordsPage }))
)
const UserAssessmentsPage = lazy(() =>
  import("@/components/user/assessments/AssessmentsPage").then((mod) => ({ default: mod.AssessmentsPage }))
)
const UserGratitudePage = lazy(() =>
  import("@/components/user/gratitude/GratitudePage").then((mod) => ({ default: mod.GratitudePage }))
)
const UserActivitiesPage = lazy(() =>
  import("@/components/user/activities/ActivitiesPage").then((mod) => ({ default: mod.ActivitiesPage }))
)
const UserProgramsPage = lazy(() =>
  import("@/components/user/programs/ProgramsPage").then((mod) => ({ default: mod.ProgramsPage }))
)
const UserProgramDetailPage = lazy(() =>
  import("@/components/user/programs/ProgramDetail").then((mod) => ({ default: mod.ProgramDetail }))
)
const UserCopingCardsPage = lazy(() =>
  import("@/components/user/coping-cards/CopingCardsPage").then((mod) => ({ default: mod.CopingCardsPage }))
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
const AdminAuditLogPage = lazy(() =>
  import("@/pages/admin/AuditLogPage").then((mod) => ({
    default: mod.AdminAuditLogPage,
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

function RootRoute() {
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  if (user.isDisabled) {
    return <Navigate to="/account-disabled" replace />
  }

  return (
    <AppLayout>
      {user.role === "admin" ? (
        <AdminDashboardPage />
      ) : user.role === "therapist" ? (
        <TherapistDashboardPage />
      ) : (
        <UserHomePage />
      )}
    </AppLayout>
  )
}

function RequireRole({
  roles,
  children,
}: {
  roles: string[]
  children: React.ReactNode
}) {
  const user = useAuthStore((state) => state.user)
  const role = user?.role ?? "user"

  if (!roles.includes(role)) return <Navigate to="/" replace />
  return <>{children}</>
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [initialize, isInitialized])

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

function RouteErrorFallback({
  retry,
}: {
  error: Error | null
  retry: () => void
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-gray-500">
          This section encountered an error. Please try again.
        </p>
        <button
          onClick={retry}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

const suspenseFallback = <PageSkeleton />

function ErrorBoundaryRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <RouteErrorFallback error={error} retry={retry} />
      )}
    >
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundaryRoute>
                <RootRoute />
              </ErrorBoundaryRoute>
            }
          />

          <Route element={<GuestRoute />}>
            <Route
              path="/login"
              element={
                <ErrorBoundaryRoute>
                  <LoginPage />
                </ErrorBoundaryRoute>
              }
            />
            <Route
              path="/signup"
              element={<Navigate to="/signup/first-name" replace />}
            />
            <Route
              path="/signup/:step"
              element={
                <ErrorBoundaryRoute>
                  <SignupPage />
                </ErrorBoundaryRoute>
              }
            />
          </Route>

          <Route
            path="/forgot-password"
            element={
              <ErrorBoundaryRoute>
                <ForgotPasswordPage />
              </ErrorBoundaryRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <ErrorBoundaryRoute>
                <ResetPasswordPage />
              </ErrorBoundaryRoute>
            }
          />
          <Route element={<ProtectedRoute />}>
          <Route
            path="/verify-email"
            element={
              <ErrorBoundaryRoute>
                <VerifyEmailPage />
              </ErrorBoundaryRoute>
            }
          />
          <Route
            path="/verify-2fa"
            element={
              <ErrorBoundaryRoute>
                <VerifyTwoFactorPage />
              </ErrorBoundaryRoute>
            }
          />
            <Route
              path="/onboarding"
              element={
                <ErrorBoundaryRoute>
                  <OnboardingPage />
                </ErrorBoundaryRoute>
              }
            />
          </Route>
          <Route
            path="/account-disabled"
            element={
              <ErrorBoundaryRoute>
                <AccountDisabledPage />
              </ErrorBoundaryRoute>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <ErrorBoundaryRoute>
                <TermsPage />
              </ErrorBoundaryRoute>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <ErrorBoundaryRoute>
                <PrivacyPage />
              </ErrorBoundaryRoute>
            }
          />
          <Route
            path="/cookie-use"
            element={
              <ErrorBoundaryRoute>
                <CookiesPage />
              </ErrorBoundaryRoute>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/chat"
                element={
                  <ErrorBoundaryRoute>
                    <UserChatPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/chat/:username"
                element={
                  <ErrorBoundaryRoute>
                    <UserChatPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ErrorBoundaryRoute>
                    <UserCommunityPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/community/:inviteKey"
                element={
                  <ErrorBoundaryRoute>
                    <UserCommunityPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/therapists"
                element={
                  <ErrorBoundaryRoute>
                    <UserTherapistsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ErrorBoundaryRoute>
                    <UserSettingsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ErrorBoundaryRoute>
                    <UserProfilePage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/therry"
                element={<Navigate to="/chat/therry" replace />}
              />
              <Route
                path="/notifications"
                element={
                  <ErrorBoundaryRoute>
                    <UserNotificationsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/mood"
                element={
                  <ErrorBoundaryRoute>
                    <UserMoodPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/crisis"
                element={
                  <ErrorBoundaryRoute>
                    <UserCrisisPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/safety-plan"
                element={
                  <ErrorBoundaryRoute>
                    <UserSafetyPlanPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/journal"
                element={
                  <ErrorBoundaryRoute>
                    <UserJournalPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/thought-records"
                element={
                  <ErrorBoundaryRoute>
                    <UserThoughtRecordsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/assessments"
                element={
                  <ErrorBoundaryRoute>
                    <UserAssessmentsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/gratitude"
                element={
                  <ErrorBoundaryRoute>
                    <UserGratitudePage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <ErrorBoundaryRoute>
                    <UserActivitiesPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/coping-cards"
                element={
                  <ErrorBoundaryRoute>
                    <UserCopingCardsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ErrorBoundaryRoute>
                    <RequireRole roles={["admin", "therapist"]}>
                      <TherapistClientsPage />
                    </RequireRole>
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ErrorBoundaryRoute>
                    <RequireRole roles={["admin"]}>
                      <AdminUsersPage />
                    </RequireRole>
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/communities"
                element={
                  <ErrorBoundaryRoute>
                    <RequireRole roles={["admin"]}>
                      <AdminCommunitiesPage />
                    </RequireRole>
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/audit"
                element={
                  <ErrorBoundaryRoute>
                    <RequireRole roles={["admin"]}>
                      <AdminAuditLogPage />
                    </RequireRole>
                  </ErrorBoundaryRoute>
                }
              />
            </Route>
          </Route>

          <Route
            path="/user/:username"
            element={
              <ErrorBoundaryRoute>
                <PublicProfilePage />
              </ErrorBoundaryRoute>
            }
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  )
}

export default App
