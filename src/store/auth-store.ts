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
  deleteAvatar as deleteAvatarRequest,
  updateChatSettings as updateChatSettingsRequest,
  updatePrivacy as updatePrivacyRequest,
  validateTwoFactor as validateTwoFactorRequest,
} from "@/lib/auth-api"
import { AuthError, NetworkError, setAuthHandlers } from "@/lib/api"
import { connectSocket, disconnectSocket } from "@/lib/socket"
import {
  syncPushSubscription,
  unregisterServiceWorker,
} from "@/lib/push"
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
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  pendingTwoFactor: { twoFactorToken: string } | null
  clearError: () => void
  setUser: (user: User | null) => void
  initialize: (isRetry?: boolean) => Promise<void>
  login: (payload: LoginPayload) => Promise<string>
  verifyTwoFactor: (code: string) => Promise<string>
  clearPendingTwoFactor: () => void
  register: (payload: RegisterPayload) => Promise<string>
  markVerified: () => void
  logout: () => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<string>
  uploadAvatar: (file: File) => Promise<void>
  deleteAvatar: () => Promise<void>
  updatePrivacy: (settings: Partial<PrivacySettings>) => Promise<void>
  updateChatSettings: (settings: Partial<ChatSettings>) => Promise<void>
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AuthError) return error.message
  if (error instanceof NetworkError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

function rethrow(message: string, cause: unknown): never {
  throw new Error(message, { cause })
}

// ====================== SESSION INIT RETRY ======================
// When the backend is briefly unreachable (e.g. a redeploy), a failed init
// must NOT log the user out - the session lives in httpOnly cookies and
// survives. Keep the persisted user and retry in the background instead.
const INIT_RETRY_DELAY_MS = 4000
const MAX_INIT_RETRIES = 6

let initRetryTimer: ReturnType<typeof setTimeout> | null = null
let initRetryCount = 0

function scheduleInitializeRetry() {
  if (initRetryTimer || initRetryCount >= MAX_INIT_RETRIES) return
  if (!useAuthStore.getState().user) return
  initRetryCount += 1
  initRetryTimer = setTimeout(() => {
    initRetryTimer = null
    void useAuthStore.getState().initialize(true)
  }, INIT_RETRY_DELAY_MS)
}

function cancelInitializeRetry() {
  if (initRetryTimer) {
    clearTimeout(initRetryTimer)
    initRetryTimer = null
  }
  initRetryCount = 0
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,
      pendingTwoFactor: null,

      clearError: () => set({ error: null }),

      setUser: (user) => set({ user }),

      initialize: async (isRetry = false) => {
        if (!isRetry) set({ isInitialized: false })
        try {
          const user = await fetchProfile()
          if (user) {
            cancelInitializeRetry()
            const chatSettings = await fetchChatSettingsRequest()
            set({ user: { ...user, chatSettings } })
            connectSocket()
            void syncPushSubscription()
          } else {
            set({ user: null })
            disconnectSocket()
          }
        } catch (error) {
          if (error instanceof AuthError) {
            // Session genuinely expired - clean logout.
            cancelInitializeRetry()
            set({ user: null })
            disconnectSocket()
          } else {
            // Transient failure (backend unreachable, e.g. redeploying).
            // Keep the persisted session and retry shortly.
            scheduleInitializeRetry()
          }
        } finally {
          set({ isInitialized: true })
        }
      },

      login: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const result = await loginRequest(payload)
          cancelInitializeRetry()
          if ("requiresTwoFactor" in result && result.requiresTwoFactor) {
            set({ pendingTwoFactor: { twoFactorToken: result.twoFactorToken } })
            return "Two-factor authentication required"
          }
          set({ user: result.user })
          connectSocket()
          void syncPushSubscription()
          return result.message
        } catch (error) {
          const message = getErrorMessage(error, "Login failed")
          set({ error: message })
          rethrow(message, error)
        } finally {
          set({ isLoading: false })
        }
      },

      verifyTwoFactor: async (code) => {
        set({ isLoading: true, error: null })
        try {
          const pending = useAuthStore.getState().pendingTwoFactor
          if (!pending) {
            throw new Error("No pending two-factor session")
          }
          const { user, message } = await validateTwoFactorRequest(code, pending.twoFactorToken)
          cancelInitializeRetry()
          set({ user, pendingTwoFactor: null })
          connectSocket()
          void syncPushSubscription()
          return message
        } catch (error) {
          const message = getErrorMessage(error, "Verification failed")
          set({ error: message })
          rethrow(message, error)
        } finally {
          set({ isLoading: false })
        }
      },

      clearPendingTwoFactor: () => set({ pendingTwoFactor: null }),

      register: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { user, message } = await registerRequest(payload)
          cancelInitializeRetry()
          set({ user })
          connectSocket()
          void syncPushSubscription()
          return message
        } catch (error) {
          const message = getErrorMessage(error, "Registration failed")
          set({ error: message })
          rethrow(message, error)
        } finally {
          set({ isLoading: false })
        }
      },

      markVerified: () =>
        set((state) => ({
          user: state.user ? { ...state.user, isAccountVerified: true } : null,
        })),

      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          await logoutRequest()
          void unregisterServiceWorker()
          cancelInitializeRetry()
          set({ user: null })
          disconnectSocket()
        } catch (error) {
          const message = getErrorMessage(error, "Logout failed")
          set({ error: message })
          rethrow(message, error)
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
          rethrow(message, error)
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
          rethrow(message, error)
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
          rethrow(message, error)
        } finally {
          set({ isLoading: false })
        }
      },

      deleteAvatar: async () => {
        set({ isLoading: true, error: null })
        try {
          const user = await deleteAvatarRequest()
          set({ user })
        } catch (error) {
          const message = getErrorMessage(error, "Remove failed")
          set({ error: message })
          rethrow(message, error)
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
          rethrow(message, error)
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
          rethrow(message, error)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// Sessions live in httpOnly cookies, so there is nothing token-related to keep
// in sync here. When the refresh cookie expires, force a clean logout.
setAuthHandlers({
  onAuthExpired: () => {
    cancelInitializeRetry()
    useAuthStore.setState({ user: null })
    disconnectSocket()
    void unregisterServiceWorker()
  },
})
