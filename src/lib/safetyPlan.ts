import {
  Users,
  Building2,
  HandHeart,
  Hash,
  Heart,
  Lightbulb,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react"

// Shared contract for the user's crisis safety plan (B1). Mirrors the backend
// SafetyPlan model: seven short user-authored lists, single plan per user,
// items encrypted at rest. Section keys MUST match the backend section fields.
export interface SafetyPlan {
  warningSigns: string[]
  internalCoping: string[]
  distractionPeople: string[]
  distractionSettings: string[]
  helpPeople: string[]
  professionals: string[]
  meansRestriction: string[]
  reasonsForLiving: string[]
}

export interface SafetyPlanSection {
  key: keyof SafetyPlan
  label: string
  hint: string
  placeholder: string
  icon: LucideIcon
}

export const SAFETY_PLAN_SECTIONS: SafetyPlanSection[] = [
  {
    key: "warningSigns",
    label: "Warning signs",
    hint: "Things that mean I might be moving toward a crisis",
    placeholder: "e.g. losing my appetite, withdrawing from friends",
    icon: ShieldAlert,
  },
  {
    key: "internalCoping",
    label: "Internal coping strategies",
    hint: "Things I can do on my own to feel better",
    placeholder: "e.g. deep breathing, taking a shower, going for a walk",
    icon: Lightbulb,
  },
  {
    key: "distractionPeople",
    label: "People for distraction",
    hint: "People I can be with to take my mind off things",
    placeholder: "e.g. my cousin Sam, college friend Priya",
    icon: Users,
  },
  {
    key: "distractionSettings",
    label: "Social settings for distraction",
    hint: "Places that help me calm down",
    placeholder: "e.g. the library, the park, the gym",
    icon: Building2,
  },
  {
    key: "helpPeople",
    label: "People I can ask for help",
    hint: "People I trust enough to tell them how I'm doing",
    placeholder: "e.g. my mom, my roommate",
    icon: HandHeart,
  },
  {
    key: "professionals",
    label: "Professionals or agencies",
    hint: "Helpers I can contact when I need more support",
    placeholder: "e.g. Dr. Kim, 988 Suicide & Crisis Lifeline",
    icon: Users,
  },
  {
    key: "meansRestriction",
    label: "Keeping me safe",
    hint: "Steps to keep means of harm away from me",
    placeholder: "e.g. give meds to my dad to hold, avoid being alone with sharp objects",
    icon: ShieldAlert,
  },
  {
    key: "reasonsForLiving",
    label: "Reasons to keep living",
    hint: "What I want to remember when things feel hopeless",
    placeholder: "e.g. my dog, my little brother, my dream job",
    icon: Heart,
  },
]

export const emptySafetyPlan = (): SafetyPlan => ({
  warningSigns: [],
  internalCoping: [],
  distractionPeople: [],
  distractionSettings: [],
  helpPeople: [],
  professionals: [],
  meansRestriction: [],
  reasonsForLiving: [],
})

export const safetyPlanHasContent = (plan: SafetyPlan): boolean =>
  SAFETY_PLAN_SECTIONS.some((section) => plan[section.key].length > 0)
