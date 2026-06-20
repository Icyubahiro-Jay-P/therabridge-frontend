import { api } from "@/lib/api"
import type {
  ChangePasswordPayload,
  LoginPayload,
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
  createdAt?: string
  updatedAt?: string
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
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<{ user: RawUser }>("/api/users/register", payload)
  return normalizeUser(data.user)
}

export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await api.post<{ user: RawUser }>("/api/users/login", payload)
  return normalizeUser(data.user)
}

export async function logout(): Promise<void> {
  await api.post("/api/users/logout")
}

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get<RawUser>("/api/users/profile")
  return normalizeUser(data)
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.put<{ user: RawUser }>("/api/users/profile", payload)
  return normalizeUser(data.user)
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.post("/api/users/change-password", payload)
}
