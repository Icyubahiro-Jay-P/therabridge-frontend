export type TipTrigger =
  | { type: "route"; path: string }
  | { type: "first-session" }
  | { type: "delay"; afterMs: number }
  | { type: "action"; action: string }

export interface TipDefinition {
  id: string
  title: string
  description: string
  trigger: TipTrigger
  /** CSS selector for the element to anchor to */
  targetSelector: string
  /** Placement relative to target */
  placement?: "top" | "bottom" | "left" | "right"
  /** Lower = shown first when multiple tips are eligible */
  priority: number
  /** Only show for these roles. Empty = all roles */
  roles?: string[]
  /** Max times to show (default 1) */
  maxShowCount?: number
  /** Feature flag / version gate — if the tip references UI that may not exist */
  version?: string
}

/**
 * Central registry of all onboarding tips.
 *
 * To add a new tip:
 * 1. Add an entry here with a unique `id`
 * 2. Add a `data-onboarding-id` attribute to the target element
 * 3. That's it — the system handles the rest
 *
 * Tips are ordered by priority. The system shows 3 tips max on first session,
 * then drips the rest contextually.
 */
export const TIPS: TipDefinition[] = [
  {
    id: "welcome-home",
    title: "Welcome to TheraBridge",
    description: "This is your home dashboard. Track your wellness journey, see recommendations, and check in with how you're feeling.",
    trigger: { type: "route", path: "/" },
    targetSelector: '[data-onboarding-id="home-dashboard"]',
    placement: "bottom",
    priority: 1,
    maxShowCount: 1,
  },
  {
    id: "start-chat",
    title: "Start a conversation",
    description: "Message friends, your therapist, or chat with Therry — your AI wellness companion available 24/7.",
    trigger: { type: "route", path: "/chat" },
    targetSelector: '[data-onboarding-id="chat-nav"]',
    placement: "right",
    priority: 2,
    maxShowCount: 1,
  },
  {
    id: "join-community",
    title: "Join a community",
    description: "Connect with others who share similar experiences. Use an invite key or browse public communities.",
    trigger: { type: "route", path: "/community" },
    targetSelector: '[data-onboarding-id="community-nav"]',
    placement: "right",
    priority: 3,
    maxShowCount: 1,
  },
  {
    id: "log-mood",
    title: "Track your mood",
    description: "Log how you're feeling to spot patterns over time. Your mood history helps you and your therapist understand your journey.",
    trigger: { type: "route", path: "/mood" },
    targetSelector: '[data-onboarding-id="mood-nav"]',
    placement: "right",
    priority: 4,
    maxShowCount: 1,
  },
  {
    id: "crisis-support",
    title: "Crisis support is here",
    description: "If you're in crisis, tap here for immediate resources, hotlines, and a direct line to your therapist.",
    trigger: { type: "delay", afterMs: 30_000 },
    targetSelector: '[data-onboarding-id="crisis-nav"]',
    placement: "right",
    priority: 5,
    maxShowCount: 1,
  },
  {
    id: "safety-plan",
    title: "Build your safety plan",
    description: "Create a personalized plan for when things get tough. List your warning signs, coping strategies, and people you trust.",
    trigger: { type: "route", path: "/safety-plan" },
    targetSelector: '[data-onboarding-id="safety-plan-content"]',
    placement: "bottom",
    priority: 6,
    maxShowCount: 1,
  },
  {
    id: "companion-pet",
    title: "Meet Sage",
    description: "Your wellness companion grows as you build healthy habits. Feed Sage, go on adventures, and watch them thrive.",
    trigger: { type: "route", path: "/pet" },
    targetSelector: '[data-onboarding-id="pet-content"]',
    placement: "bottom",
    priority: 7,
    maxShowCount: 1,
  },
  {
    id: "settings-tip",
    title: "Customize your experience",
    description: "Adjust chat settings, privacy preferences, themes, and more. Make TheraBridge work for you.",
    trigger: { type: "route", path: "/settings" },
    targetSelector: '[data-onboarding-id="settings-content"]',
    placement: "bottom",
    priority: 8,
    maxShowCount: 1,
  },
]

/** Maximum tips to show per session */
export const MAX_TIPS_PER_SESSION = 4

/** Delay before showing the first tip after login (ms) */
export const FIRST_TIP_DELAY_MS = 1500

/** Delay between consecutive tips (ms) */
export const TIP_COOLDOWN_MS = 4000
