export type UserRole = "user" | "admin" | "therapist"

export interface WeeklyAvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  role: UserRole
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
  specialization?: string[]
  credentials?: string
  yearsExperience?: number
  languages?: string[]
  weeklyAvailability?: WeeklyAvailabilitySlot[]
}

export interface TherapistProfile extends User {
  _id?: string
  rating: number
  reviewCount: number
}

export interface ChatSettings {
  readReceipts: boolean
  screenshotProtection?: boolean
  watermarkEnabled?: boolean
}

export interface PrivacySettings {
  firstName: "public" | "private"
  lastName: "public" | "private"
  email: "public" | "private"
  dateOfBirth: "public" | "private"
  bio: "public" | "private"
}

export type PrivacyField = keyof PrivacySettings

export interface PublicProfile {
  _id: string
  username: string
  firstName: string | null
  lastName: string | null
  email: string | null
  dateOfBirth: string | null
  bio: string | null
  role: UserRole
  avatar?: string | null
  createdAt?: string
  exerciseScore?: number
  loginStreak?: number
  exerciseStreak?: number
  longestLoginStreak?: number
  longestExerciseStreak?: number
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  dateOfBirth: string
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  bio?: string
  specialization?: string[]
  credentials?: string
  yearsExperience?: number
  languages?: string[]
  weeklyAvailability?: WeeklyAvailabilitySlot[]
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
