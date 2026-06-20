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
