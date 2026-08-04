import { AtSign, Calendar as CalendarIcon, Lock, Mail, User, type LucideIcon } from "lucide-react"
import type { FieldName } from "./useSignupState"

export const STEP_ITEMS: Array<{
  field: FieldName
  slug: string
  label: string
  placeholder?: string
  icon: LucideIcon
  autoComplete?: string
  inputType?: string
}> = [
  {
    field: "firstName",
    slug: "first-name",
    label: "First name",
    placeholder: "First name",
    icon: User,
    autoComplete: "given-name",
  },
  {
    field: "lastName",
    slug: "last-name",
    label: "Last name",
    placeholder: "Last name",
    icon: User,
    autoComplete: "family-name",
  },
  {
    field: "username",
    slug: "username",
    label: "Username",
    placeholder: "username",
    icon: AtSign,
    autoComplete: "username",
  },
  {
    field: "email",
    slug: "email",
    label: "Email",
    placeholder: "Email address",
    icon: Mail,
    inputType: "email",
    autoComplete: "email",
  },
  {
    field: "dateOfBirth",
    slug: "date-of-birth",
    label: "Date of birth",
    placeholder: "Pick a date",
    icon: CalendarIcon,
  },
  {
    field: "password",
    slug: "password",
    label: "Password",
    placeholder: "Min. 8 characters",
    icon: Lock,
    inputType: "password",
    autoComplete: "new-password",
  },
]

export const STEP_COUNT = STEP_ITEMS.length

export function getStepIndex(slug: string | undefined): number {
  if (!slug) return 0
  return STEP_ITEMS.findIndex((item) => item.slug === slug)
}
