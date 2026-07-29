import {
  AtSign,
  Calendar as CalendarIcon,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
  User,
  type LucideIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { FieldName, FieldErrors, Feedback } from "./useSignupState"

const stepItems: Array<{
  field: FieldName
  label: string
  placeholder?: string
  icon: LucideIcon
  autoComplete?: string
  inputType?: string
}> = [
  {
    field: "firstName",
    label: "First name",
    placeholder: "First name",
    icon: User,
    autoComplete: "given-name",
  },
  {
    field: "lastName",
    label: "Last name",
    placeholder: "Last name",
    icon: User,
    autoComplete: "family-name",
  },
  {
    field: "username",
    label: "Username",
    placeholder: "username",
    icon: AtSign,
    autoComplete: "username",
  },
  {
    field: "email",
    label: "Email",
    placeholder: "Email address",
    icon: Mail,
    inputType: "email",
    autoComplete: "email",
  },
  {
    field: "dateOfBirth",
    label: "Date of birth",
    placeholder: "Pick a date",
    icon: CalendarIcon,
  },
  {
    field: "password",
    label: "Password",
    placeholder: "Min. 8 characters",
    icon: Lock,
    inputType: "password",
    autoComplete: "new-password",
  },
]

function validateField(field: FieldName, value: string, date?: Date) {
  if (field === "firstName" || field === "lastName") {
    if (!value.trim() || value.trim().length < 2) {
      return `${field === "firstName" ? "First" : "Last"} name must be at least 2 characters.`
    }
  }

  if (field === "username") {
    if (!value.trim()) return "Username is required."
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(value.trim())) {
      return "Letters, numbers, underscores only (3–30 chars)."
    }
  }

  if (field === "email") {
    if (!value.trim()) return "Email is required."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Invalid email format."
    }
  }

  if (field === "dateOfBirth") {
    if (!date) return "Date of birth is required."
    const age = new Date().getFullYear() - date.getFullYear()
    if (age < 18 || age > 120)
      return "You must be between 18 and 120 years old."
  }

  if (field === "password") {
    if (!value) return "Password is required."
    if (value.length < 8) return "Password must be at least 8 characters."
  }

  return undefined
}

export function SignupForm({
  form,
  date,
  showPassword,
  feedback: fb,
  fieldErrors: fe,
  isLoading: l,
  updateField: uf,
  handleBlur: hb,
  handleDateSelect: hds,
  handleSubmit: hs,
  setShowPassword: sp,
}: {
  form: Record<FieldName, string>
  date: Date | undefined
  showPassword: boolean
  feedback: Feedback | null
  fieldErrors: FieldErrors
  isLoading: boolean
  updateField: (f: FieldName, v: string) => void
  handleBlur: (f: FieldName) => void
  handleDateSelect: (d: Date | undefined) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [step, setStep] = useState(0)
  const [, setDirection] = useState<"forward" | "backward">("forward")

  const currentStep = stepItems[step]
  const currentValue =
    currentStep.field === "dateOfBirth"
      ? form.dateOfBirth
      : form[currentStep.field]
  const currentError =
    fe[currentStep.field] ??
    validateField(currentStep.field, currentValue, date)
  const isLastStep = step === stepItems.length - 1

  const progress = useMemo(() => ((step + 1) / stepItems.length) * 100, [step])

  function moveTo(next: number) {
    setDirection(next > step ? "forward" : "backward")
    setStep(next)
  }

  function handleStepSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (currentError) {
      hb(currentStep.field)
      return
    }

    if (isLastStep) {
      hs(event)
      return
    }

    moveTo(step + 1)
  }

  return (
    <>
      {fb && (
        <div
          role="alert"
          className={cn(
            "mb-5 flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium",
            fb.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
          )}
        >
          <span className="shrink-0">
            {fb.type === "error" ? (
              <TriangleAlert className="size-4" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
          </span>
          <span>{fb.message}</span>
        </div>
      )}

      <form onSubmit={handleStepSubmit} noValidate className="space-y-2">
        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Step {step + 1} of {stepItems.length}
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {currentStep.label}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative min-h-[6rem] overflow-hidden bg-white/0 px-0 py-3">
          {stepItems.map((item, index) => {
            const isActive = index === step
            const positionClass = isActive
              ? "translate-x-0 opacity-100"
              : index < step
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"

            return (
              <div
                key={item.field}
                className={cn(
                  "absolute inset-x-0 top-0 transition-all duration-300 ease-out",
                  positionClass,
                  isActive ? "pointer-events-auto" : "pointer-events-none"
                )}
              >
                <div className="space-y-4 px-0">
                  <div className="space-y-1.5">
                    <Label htmlFor={item.field} className="text-sm font-medium">
                      {item.label}
                    </Label>

                    {item.field === "dateOfBirth" ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={l}
                            className={cn(
                              "relative w-full justify-start pl-9 text-left font-normal",
                              !date && "text-muted-foreground",
                              fe.dateOfBirth &&
                                "border-red-400 dark:border-red-600"
                            )}
                          >
                            <CalendarIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={hds}
                            captionLayout="dropdown"
                            disabled={(d) =>
                              d > new Date() || d < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="relative">
                        <item.icon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id={item.field}
                          type={item.inputType ?? "text"}
                          autoComplete={item.autoComplete}
                          placeholder={item.placeholder}
                          value={form[item.field]}
                          onChange={(e) => uf(item.field, e.target.value)}
                          onBlur={() => hb(item.field)}
                          disabled={l}
                          className={cn(
                            "pl-9",
                            item.field === "password" && "pr-10",
                            fe[item.field] &&
                              "border-red-400 dark:border-red-600"
                          )}
                        />

                        {item.field === "password" ? (
                          <button
                            type="button"
                            onClick={() => sp((v) => !v)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            tabIndex={-1}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {(fe[item.field] ||
                    (item.field === currentStep.field
                      ? currentError
                      : undefined)) && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {fe[item.field] ?? currentError}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={step === 0 || l}
            onClick={() => moveTo(step - 1)}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={l}
            className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
          >
            {l ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Creating…
              </span>
            ) : isLastStep ? (
              "Create"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </>
  )
}
