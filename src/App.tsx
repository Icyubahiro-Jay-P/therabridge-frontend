import { Navigate, Route, Routes } from "react-router-dom"

import { GuestRoute, ProtectedRoute } from "@/components/shared/auth/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"

import { RootRoute, RequireRole, AuthInitializer, ErrorBoundaryRoute } from "./routeHelpers"

import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  VerifyTwoFactorPage,
  OnboardingPage,
  PublicProfilePage,
  NotFoundPage,
  AccountDisabledPage,
  TermsPage,
  PrivacyPage,
  CookiesPage,
  UserChatPage,
  UserCommunityPage,
  UserTherapistsPage,
  UserSettingsPage,
  UserProfilePage,
  UserNotificationsPage,
  UserMoodPage,
  UserCrisisPage,
  UserSafetyPlanPage,
  UserJournalPage,
  UserThoughtRecordsPage,
  UserAssessmentsPage,
  UserGratitudePage,
  UserActivitiesPage,
  UserProgramsPage,
  UserProgramDetailPage,
  UserCopingCardsPage,
  UserPsychoedPage,
  UserSleepPage,
  UserMedicationsPage,
  UserPetPage,
  UserHabitsPage,
  AdminUsersPage,
  AdminCommunitiesPage,
  AdminAuditLogPage,
  TherapistClientsPage,
} from "./routes"

export function App() {
  return (
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
          <Route
            path="/verify-2fa"
            element={
              <ErrorBoundaryRoute>
                <VerifyTwoFactorPage />
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
                path="/programs"
                element={
                  <ErrorBoundaryRoute>
                    <UserProgramsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/programs/:id"
                element={
                  <ErrorBoundaryRoute>
                    <UserProgramDetailPage />
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
                path="/learn"
                element={
                  <ErrorBoundaryRoute>
                    <UserPsychoedPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/sleep"
                element={
                  <ErrorBoundaryRoute>
                    <UserSleepPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/medications"
                element={
                  <ErrorBoundaryRoute>
                    <UserMedicationsPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/pet"
                element={
                  <ErrorBoundaryRoute>
                    <UserPetPage />
                  </ErrorBoundaryRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <ErrorBoundaryRoute>
                    <UserHabitsPage />
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
  )
}

export default App
