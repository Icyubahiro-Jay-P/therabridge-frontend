import { createContext } from "react"

interface OnboardingContextValue {
  showTip: (tipId: string) => void
  dismissActiveTip: () => void
}

export const OnboardingContext = createContext<OnboardingContextValue>({
  showTip: () => {},
  dismissActiveTip: () => {},
})
