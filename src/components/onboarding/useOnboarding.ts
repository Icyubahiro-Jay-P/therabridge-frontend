import { useContext, useCallback } from "react"
import { OnboardingContext } from "./OnboardingProvider"
import { useOnboardingStore } from "@/store/onboarding-store"
import { TIPS } from "@/lib/onboarding/config"

/**
 * Hook for integrating onboarding tips into components.
 *
 * Usage:
 * ```tsx
 * // In a component that is a tip target:
 * const { ref } = useOnboardingTarget("welcome-home")
 *
 * // To programmatically show a tip:
 * const { showTip } = useOnboarding()
 * showTip("start-chat")
 *
 * // To check if a tip is active for this component:
 * const { isActive } = useOnboardingTarget("welcome-home")
 * ```
 */
export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  const { shouldShowTip, activeTipId, onboardingDisabled } = useOnboardingStore()

  return {
    ...ctx,
    /** Check if a specific tip is currently showing */
    isActive: (tipId: string) => activeTipId === tipId,
    /** Check if a specific tip is eligible to show */
    canShow: (tipId: string) => shouldShowTip(tipId),
    onboardingDisabled,
    tips: TIPS,
  }
}

/**
 * Hook to register a component as a tip target.
 * Returns a ref callback and whether the tip targeting this element is active.
 */
export function useOnboardingTarget(tipId: string) {
  const { activeTipId, shouldShowTip } = useOnboardingStore()
  const tip = TIPS.find((t) => t.id === tipId)

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node || !tip) return
      node.setAttribute("data-onboarding-id", tip.targetSelector.replace('[data-onboarding-id="', "").replace('"]', ""))
    },
    [tip],
  )

  return {
    ref,
    isActive: activeTipId === tipId,
    canShow: shouldShowTip(tipId),
  }
}
