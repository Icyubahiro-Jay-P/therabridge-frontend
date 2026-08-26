import { createContext, useCallback, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { useOnboardingStore } from "@/store/onboarding-store"
import { TIPS, FIRST_TIP_DELAY_MS, TIP_COOLDOWN_MS } from "@/lib/onboarding/config"
import { Coachmark } from "./Coachmark"

interface OnboardingContextValue {
  /** Programmatically trigger a tip by ID */
  showTip: (tipId: string) => void
  /** Dismiss the currently active tip */
  dismissActiveTip: () => void
}

export const OnboardingContext = createContext<OnboardingContextValue>({
  showTip: () => {},
  dismissActiveTip: () => {},
})

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const {
    activeTipId,
    setActiveTip,
    markShown,
    dismissTip,
    shouldShowTip,
    sessionLimitReached,
    onboardingDisabled,
    eligibleTipIds,
    setEligibleTips,
    resetSession,
  } = useOnboardingStore()

  const [cooldownUntil, setCooldownUntil] = useState(0)
  const initTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset session on mount (new login)
  useEffect(() => {
    resetSession()
  }, [resetSession])

  // Update eligible tips based on current route
  useEffect(() => {
    const eligible = TIPS.filter((tip) => {
      if (tip.trigger.type === "route") {
        return location.pathname === tip.trigger.path || 
               (tip.trigger.path !== "/" && location.pathname.startsWith(tip.trigger.path))
      }
      if (tip.trigger.type === "first-session") return true
      return false
    }).map((t) => t.id)

    setEligibleTips([...new Set([...eligibleTipIds, ...eligible])])
  }, [location.pathname, setEligibleTips]) // eslint-disable-line react-hooks/exhaustive-deps

  // Delay timer for delayed tips
  useEffect(() => {
    if (onboardingDisabled || sessionLimitReached()) return

    const delayedTips = TIPS.filter((t) => t.trigger.type === "delay")
    for (const tip of delayedTips) {
      const trigger = tip.trigger as { type: "delay"; afterMs: number }
      if (eligibleTipIds.includes(tip.id)) continue
      if (!shouldShowTip(tip.id)) continue

      const timer = setTimeout(() => {
        setEligibleTips([...eligibleTipIds, tip.id])
      }, trigger.afterMs)
      return () => clearTimeout(timer)
    }
  }, [eligibleTipIds, onboardingDisabled, sessionLimitReached, setEligibleTips, shouldShowTip])

  // Determine which tip to show
  useEffect(() => {
    if (onboardingDisabled || sessionLimitReached() || activeTipId) return
    if (Date.now() < cooldownUntil) return

    const next = useOnboardingStore.getState().getNextTip()
    if (next) {
      const timer = setTimeout(() => {
        setActiveTip(next)
        markShown(next)
      }, FIRST_TIP_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [eligibleTipIds, onboardingDisabled, sessionLimitReached, activeTipId, cooldownUntil, setActiveTip, markShown])

  const dismissActiveTip = useCallback(() => {
    if (!activeTipId) return
    dismissTip(activeTipId)
    setActiveTip(null)
    setCooldownUntil(Date.now() + TIP_COOLDOWN_MS)
  }, [activeTipId, dismissTip, setActiveTip])

  const showTip = useCallback(
    (tipId: string) => {
      if (!shouldShowTip(tipId)) return
      if (activeTipId) dismissActiveTip()
      setActiveTip(tipId)
      markShown(tipId)
    },
    [shouldShowTip, activeTipId, dismissActiveTip, setActiveTip, markShown],
  )

  const activeTip = activeTipId ? TIPS.find((t) => t.id === activeTipId) : null

  return (
    <OnboardingContext.Provider value={{ showTip, dismissActiveTip }}>
      {children}
      {activeTip && (
        <Coachmark
          targetSelector={activeTip.targetSelector}
          title={activeTip.title}
          description={activeTip.description}
          placement={activeTip.placement}
          onDismiss={dismissActiveTip}
          onGotIt={dismissActiveTip}
        />
      )}
    </OnboardingContext.Provider>
  )
}
