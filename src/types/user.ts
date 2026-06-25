export type UserRole = "user" | "admin" | "therapist"

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
  createdAt?: string
  updatedAt?: string
  privacySettings?: PrivacySettings
  chatSettings?: ChatSettings
}

export interface ChatSettings {
  readReceipts: boolean
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
  avatar?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
