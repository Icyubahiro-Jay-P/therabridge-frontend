import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  fetchProfile,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
  uploadAvatar as uploadAvatarRequest,
  updatePrivacy as updatePrivacyRequest,
} from "@/lib/auth-api";
import type {
  ChangePasswordPayload,
  LoginPayload,
  PrivacySettings,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<string>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  updatePrivacy: (settings: Partial<PrivacySettings>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isInitialized: false,

      initialize: async () => {
        set({ isInitialized: true });
        try {
          const user = await fetchProfile();
          if (user) set({ user });
        } catch {}
      },

      login: async (payload) => {
        set({ isLoading: true });
        try {
          const { user, message } = await loginRequest(payload);
          set({ user });
          return message;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Login failed";
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const { user, message } = await registerRequest(payload);
          set({ user });
          return message;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Registration failed";
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutRequest();
          set({ user: null });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Logout failed";
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (payload) => {
        set({ isLoading: true });
        try {
          const user = await updateProfileRequest(payload);
          set({ user });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Update failed";
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      changePassword: async (payload) => {
        set({ isLoading: true });
        try {
          await changePasswordRequest(payload);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Password change failed";
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      uploadAvatar: async (file) => {
        set({ isLoading: true });
        try {
          const user = await uploadAvatarRequest(file);
          set({ user });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Upload failed";
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      updatePrivacy: async (settings) => {
        set({ isLoading: true });
        try {
          const privacySettings = await updatePrivacyRequest(settings);
          set((state) => ({
            user: state.user ? { ...state.user, privacySettings } : null,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Update failed";
          throw new Error(message);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isInitialized: state.isInitialized }),
    }
  )
);
