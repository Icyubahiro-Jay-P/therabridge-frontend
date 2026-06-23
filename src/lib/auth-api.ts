// src/lib/auth-api.ts
import { api } from "@/lib/api";
import type {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/user";

type RawUser = {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  role: User["role"];
  avatar?: string | null;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

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
  };
}

type AuthResponse = {
  message: string;
  user: RawUser;
};

export async function register(
  payload: RegisterPayload
): Promise<{ user: User; message: string }> {
  const { data } = await api.post<AuthResponse>(
    "/api/users/register",
    payload
  );
  return { user: normalizeUser(data.user), message: data.message };
}

export async function login(
  payload: LoginPayload
): Promise<{ user: User; message: string }> {
  const { data } = await api.post<AuthResponse>("/api/users/login", payload);
  return { user: normalizeUser(data.user), message: data.message };
}

export async function logout(): Promise<void> {
  await api.post("/api/users/logout");
}

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get<RawUser>("/api/users/profile");
  return normalizeUser(data);
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.put<{ user: RawUser }>("/api/users/profile", payload);
  return normalizeUser(data.user);
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.post("/api/users/change-password", payload);
}

export async function forgotPassword(email: string): Promise<string> {
  const { data } = await api.post<{ success: boolean; data: string }>(
    "/api/users/forgot-password",
    { email }
  );
  return data.data;
}

export async function resetPassword(
  token: string,
  password: string
): Promise<string> {
  const { data } = await api.post<{ success: boolean; message: string }>(
    `/api/users/reset-password/${token}`,
    { password }
  );
  return data.message;
}