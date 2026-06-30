import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  fetchChatSettings as fetchChatSettingsRequest,
  fetchProfile,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
  uploadAvatar as uploadAvatarRequest,
  updateChatSettings as updateChatSettingsRequest,
  updatePrivacy as updatePrivacyRequest,
} from "@/lib/auth-api"
import { AuthError, NetworkError, setAuthToken } from "@/lib/api"
import type {
  ChangePasswordPayload,
  ChatSettings,
  LoginPayload,
  PrivacySettings,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/user"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  clearError: () => void
  initialize: () => Promise<void>
  login: (payload: LoginPayload) => Promise<string>
  register: (payload: RegisterPayload) => Promise<string>
  logout: () => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<string>
  uploadAvatar: (file: File) => Promise<void>
  updatePrivacy: (settings: Partial<PrivacySettings>) => Promise<void>
  updateChatSettings: (settings: Partial<ChatSettings>) => Promise<void>
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AuthError) return error.message
  if (error instanceof NetworkError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      clearError: () => set({ error: null }),

      initialize: async () => {
        set({ isInitialized: false })
        try {
          const user = await fetchProfile()
          if (user) {
            const chatSettings = await fetchChatSettingsRequest()
            set({ user: { ...user, chatSettings } })
          } else {
            set({ user: null })
            set({ token: null })
          }
        } catch {
          set({ user: null, token: null })
        } finally {
          set({ isInitialized: true })
        }
      },

      login: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token, message } = await loginRequest(payload)
          set({ user, token })
          setAuthToken(token)
          return message
        } catch (error) {
          const message = getErrorMessage(error, "Login failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token, message } = await registerRequest(payload)
          set({ user, token })
          setAuthToken(token)
          return message
        } catch (error) {
          const message = getErrorMessage(error, "Registration failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          await logoutRequest()
          set({ user: null, token: null })
          setAuthToken(null)
        } catch (error) {
          const message = getErrorMessage(error, "Logout failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },

      updateProfile: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const user = await updateProfileRequest(payload)
          set({ user })
        } catch (error) {
          const message = getErrorMessage(error, "Update failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },

      changePassword: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          await changePasswordRequest(payload)
          return "Password changed successfully"
        } catch (error) {
          const message = getErrorMessage(error, "Password change failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },

      uploadAvatar: async (file) => {
        set({ isLoading: true, error: null })
        try {
          const user = await uploadAvatarRequest(file)
          set({ user })
        } catch (error) {
          const message = getErrorMessage(error, "Upload failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },

      updatePrivacy: async (settings) => {
        set({ isLoading: true, error: null })
        try {
          const privacySettings = await updatePrivacyRequest(settings)
          set((state) => ({
            user: state.user ? { ...state.user, privacySettings } : null,
          }))
        } catch (error) {
          const message = getErrorMessage(error, "Update failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },

      updateChatSettings: async (settings) => {
        set({ isLoading: true, error: null })
        try {
          const chatSettings = await updateChatSettingsRequest(settings)
          set((state) => ({
            user: state.user ? { ...state.user, chatSettings } : null,
          }))
        } catch (error) {
          const message = getErrorMessage(error, "Update failed")
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
