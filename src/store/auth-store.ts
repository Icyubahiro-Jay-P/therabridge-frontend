import { create } from "zustand"

import {
  fetchProfile,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
} from "@/lib/auth-api"
import { getErrorMessage } from "@/lib/api"
import type {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/user"

interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  initialize: () => Promise<void>
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true })
    try {
      const user = await fetchProfile()
      set({ user, isInitialized: true })
    } catch {
      set({ user: null, isInitialized: true })
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (payload) => {
    set({ isLoading: true })
    try {
      const user = await loginRequest(payload)
      set({ user })
    } catch (error) {
      throw new Error(getErrorMessage(error))
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (payload) => {
    set({ isLoading: true })
    try {
      const user = await registerRequest(payload)
      set({ user })
    } catch (error) {
      throw new Error(getErrorMessage(error))
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await logoutRequest()
      set({ user: null })
    } catch (error) {
      throw new Error(getErrorMessage(error))
    } finally {
      set({ isLoading: false })
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true })
    try {
      const user = await updateProfileRequest(payload)
      set({ user })
    } catch (error) {
      throw new Error(getErrorMessage(error))
    } finally {
      set({ isLoading: false })
    }
  },

  changePassword: async (payload) => {
    set({ isLoading: true })
    try {
      await changePasswordRequest(payload)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    } finally {
      set({ isLoading: false })
    }
  },
}))
