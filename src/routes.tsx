import { lazy } from "react"

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
const UserPsychoedPage = lazy(() =>
  import("@/components/user/psychoed/PsychoedPage").then((mod) => ({ default: mod.PsychoedPage }))
)
const UserSleepPage = lazy(() =>
  import("@/components/user/sleep/SleepPage").then((mod) => ({ default: mod.SleepPage }))
)
const UserMedicationsPage = lazy(() =>
  import("@/components/user/medications/MedicationsPage").then((mod) => ({ default: mod.MedicationsPage }))
)
const UserPetPage = lazy(() =>
  import("@/components/user/pet/PetPage").then((mod) => ({ default: mod.PetPage }))
)
const UserHabitsPage = lazy(() =>
  import("@/components/user/habits/HabitsPage").then((mod) => ({ default: mod.HabitsPage }))
)
const UserSessionsPage = lazy(() =>
  import("@/pages/user/SessionsPage").then((mod) => ({ default: mod.SessionsPage }))
)
const UserTherapistProfilePage = lazy(() =>
  import("@/pages/user/TherapistProfilePage").then((mod) => ({ default: mod.TherapistProfilePage }))
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

export {
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
  LandingPage,
  TermsPage,
  PrivacyPage,
  CookiesPage,
  UserHomePage,
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
  UserSessionsPage,
  UserTherapistProfilePage,
  AdminDashboardPage,
  AdminUsersPage,
  AdminCommunitiesPage,
  AdminAuditLogPage,
  TherapistDashboardPage,
  TherapistClientsPage,
}
