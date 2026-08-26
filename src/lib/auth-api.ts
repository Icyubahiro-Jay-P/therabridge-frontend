// src/lib/auth-api.ts
import { api } from "@/lib/api"
import type {
  ChangePasswordPayload,
  ChatSettings,
  LoginPayload,
  PrivacySettings,
  PublicProfile,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/user"

type RawUser = {
  id?: string
  _id?: string
  username: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  role: User["role"]
  avatar?: string | null
  bio?: string
  isDisabled?: boolean
  isAccountVerified?: boolean
  createdAt?: string
  updatedAt?: string
  privacySettings?: PrivacySettings
  chatSettings?: ChatSettings
  exerciseScore?: number
  loginStreak?: number
  exerciseStreak?: number
  longestLoginStreak?: number
  longestExerciseStreak?: number
  twoFactorEnabled?: boolean
}

function normalizeUser(raw: RawUser): User {
  return {
    id: raw.id ?? raw._id ?? "",
    username: raw.username,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    dateOfBirth: raw.dateOfBirth,
    role: raw.role,
    avatar: raw.avatar,
    bio: raw.bio,
    isDisabled: raw.isDisabled,
    isAccountVerified: raw.isAccountVerified,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    privacySettings: raw.privacySettings,
    chatSettings: raw.chatSettings,
    exerciseScore: raw.exerciseScore,
    loginStreak: raw.loginStreak,
    exerciseStreak: raw.exerciseStreak,
    longestLoginStreak: raw.longestLoginStreak,
    longestExerciseStreak: raw.longestExerciseStreak,
    twoFactorEnabled: raw.twoFactorEnabled,
  }
}

type AuthResponse = {
  message: string
  user?: RawUser
  requiresTwoFactor?: boolean
  twoFactorToken?: string
}

export async function register(
  payload: RegisterPayload
): Promise<{ user: User; message: string }> {
  const { data } = await api.post<AuthResponse>("/api/users/register", payload)
  return {
    user: normalizeUser(data.user!),
    message: data.message,
  }
}

export async function login(
  payload: LoginPayload
): Promise<{ user: User; message: string } | { requiresTwoFactor: true; twoFactorToken: string }> {
  const { data } = await api.post<AuthResponse>("/api/users/login", payload)
  if (data.requiresTwoFactor && data.twoFactorToken) {
    return { requiresTwoFactor: true, twoFactorToken: data.twoFactorToken }
  }
  return {
    user: normalizeUser(data.user!),
    message: data.message,
  }
}

export async function logout(): Promise<void> {
  await api.post("/api/users/logout")
}

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get<RawUser>("/api/users/profile")
  return normalizeUser(data)
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<User> {
  const { data } = await api.put<{ user: RawUser }>(
    "/api/users/profile",
    payload
  )
  return normalizeUser(data.user)
}

export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData()
  formData.append("avatar", file)
  const { data } = await api.post<{ user: RawUser }>(
    "/api/users/upload-avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
  return normalizeUser(data.user)
}

export async function deleteAvatar(): Promise<User> {
  const { data } = await api.delete<{ user: RawUser }>("/api/users/avatar")
  return normalizeUser(data.user)
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<void> {
  await api.post("/api/users/change-password", payload)
}

export async function forgotPassword(email: string): Promise<string> {
  const { data } = await api.post<{ success: boolean; data: string }>(
    "/api/users/forgot-password",
    { email }
  )
  return data.data
}

export async function resetPassword(
  token: string,
  password: string
): Promise<string> {
  const { data } = await api.post<{ success: boolean; message: string }>(
    `/api/users/reset-password/${token}`,
    { password }
  )
  return data.message
}

export async function verifyEmail(code: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string; isAccountVerified: boolean }>(
    "/api/users/verify-email",
    { code }
  )
  return data
}

export async function resendVerification(email: string): Promise<number> {
  const { data } = await api.post<{ message: string; resendCooldownSeconds: number }>(
    "/api/users/resend-verification",
    { email }
  )
  return data.resendCooldownSeconds ?? 60
}

export async function fetchPublicProfile(
  username: string
): Promise<PublicProfile> {
  const clean = username.startsWith("@") ? username.slice(1) : username
  const { data } = await api.get<PublicProfile>(`/api/users/${clean}`)
  return data
}

export async function fetchChatSettings(): Promise<ChatSettings> {
  const { data } = await api.get<ChatSettings>("/api/chat/settings")
  return data
}

export async function updateChatSettings(
  chatSettings: Partial<ChatSettings>
): Promise<ChatSettings> {
  const { data } = await api.put<{ chatSettings: ChatSettings }>(
    "/api/chat/settings",
    { chatSettings }
  )
  return data.chatSettings
}

export async function updatePrivacy(
  privacySettings: Partial<PrivacySettings>
): Promise<PrivacySettings> {
  const { data } = await api.put<{ privacySettings: PrivacySettings }>(
    "/api/users/privacy",
    { privacySettings }
  )
  return data.privacySettings
}

// ─── Two-Factor Authentication ──────────────────────────────────────────────

export interface TwoFactorSetupResponse {
  message: string
  qrCode: string
  secret: string
  alreadyEnabled?: boolean
}

export interface TwoFactorStatusResponse {
  enabled: boolean
  backupCodesRemaining: number
}

export async function setupTwoFactor(): Promise<TwoFactorSetupResponse> {
  const { data } = await api.post<TwoFactorSetupResponse>("/api/users/2fa/setup")
  return data
}

export async function verifyTwoFactorSetup(code: string): Promise<{ message: string; backupCodes: string[] }> {
  const { data } = await api.post<{ message: string; backupCodes: string[] }>(
    "/api/users/2fa/verify-setup",
    { code }
  )
  return data
}

export async function validateTwoFactor(
  code: string,
  twoFactorToken: string
): Promise<{ user: User; message: string }> {
  const { data } = await api.post<AuthResponse>(
    "/api/users/2fa/validate",
    { code },
    { headers: { Authorization: `Bearer ${twoFactorToken}` } }
  )
  return {
    user: normalizeUser(data.user!),
    message: data.message,
  }
}

export async function disableTwoFactor(
  password: string,
  code: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>("/api/users/2fa/disable", {
    data: { password, code },
  })
  return data
}

export async function getTwoFactorStatus(): Promise<TwoFactorStatusResponse> {
  const { data } = await api.get<TwoFactorStatusResponse>("/api/users/2fa/status")
  return data
}
