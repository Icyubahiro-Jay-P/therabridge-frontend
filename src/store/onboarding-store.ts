import { create } from "zustand"
import { persist } from "zustand/middleware"
import { TIPS, MAX_TIPS_PER_SESSION } from "@/lib/onboarding/config"

interface TipState {
  /** Tips the user explicitly dismissed or that were shown and auto-dismissed */
  dismissedTips: Record<string, number>
  /** Number of tips shown this session */
  tipsShownThisSession: number
  /** Whether the onboarding system is globally disabled by the user */
  onboardingDisabled: boolean
  /** Currently active tip id (or null) */
  activeTipId: string | null
  /** Set of tip IDs eligible to show right now */
  eligibleTipIds: string[]
}

interface TipActions {
  /** Check if a specific tip should be shown */
  shouldShowTip: (tipId: string) => boolean
  /** Mark a tip as dismissed (user clicked X or "Got it") */
  dismissTip: (tipId: string) => void
  /** Mark a tip as shown */
  markShown: (tipId: string) => void
  /** Set the currently active tip */
  setActiveTip: (tipId: string | null) => void
  /** Set eligible tips */
  setEligibleTips: (ids: string[]) => void
  /** Skip the entire onboarding flow */
  disableOnboarding: () => void
  /** Re-enable onboarding (for testing) */
  enableOnboarding: () => void
  /** Check if session tip limit is reached */
  sessionLimitReached: () => boolean
  /** Reset session counter (on new login) */
  resetSession: () => void
  /** Get the next eligible tip to show */
  getNextTip: () => string | null
}

export const useOnboardingStore = create<TipState & TipActions>()(
  persist(
    (set, get) => ({
      dismissedTips: {},
      tipsShownThisSession: 0,
      onboardingDisabled: false,
      activeTipId: null,
      eligibleTipIds: [],

      shouldShowTip: (tipId: string) => {
        const state = get()
        if (state.onboardingDisabled) return false
        if (state.activeTipId && state.activeTipId !== tipId) return false
        const tip = TIPS.find((t) => t.id === tipId)
        if (!tip) return false
        const showCount = state.dismissedTips[tipId] ?? 0
        if (showCount >= (tip.maxShowCount ?? 1)) return false
        return true
      },

      dismissTip: (tipId: string) => {
        set((state) => ({
          dismissedTips: {
            ...state.dismissedTips,
            [tipId]: (state.dismissedTips[tipId] ?? 0) + 1,
          },
          activeTipId: state.activeTipId === tipId ? null : state.activeTipId,
        }))
      },

      markShown: (tipId: string) => {
        set((state) => ({
          dismissedTips: {
            ...state.dismissedTips,
            [tipId]: (state.dismissedTips[tipId] ?? 0) + 1,
          },
          tipsShownThisSession: state.tipsShownThisSession + 1,
        }))
      },

      setActiveTip: (tipId) => set({ activeTipId: tipId }),

      setEligibleTips: (ids) => set({ eligibleTipIds: ids }),

      disableOnboarding: () => set({ onboardingDisabled: true, activeTipId: null }),

      enableOnboarding: () => set({ onboardingDisabled: false }),

      sessionLimitReached: () => {
        return get().tipsShownThisSession >= MAX_TIPS_PER_SESSION
      },

      resetSession: () => set({ tipsShownThisSession: 0, activeTipId: null }),

      getNextTip: () => {
        const state = get()
        if (state.onboardingDisabled) return null
        if (state.sessionLimitReached()) return null
        const sorted = TIPS.filter(
          (t) =>
            state.eligibleTipIds.includes(t.id) &&
            (state.dismissedTips[t.id] ?? 0) < (t.maxShowCount ?? 1),
        ).sort((a, b) => a.priority - b.priority)
        return sorted[0]?.id ?? null
      },
    }),
    {
      name: "therabridge-onboarding",
      partialize: (state) => ({
        dismissedTips: state.dismissedTips,
        onboardingDisabled: state.onboardingDisabled,
      }),
    },
  ),
)
