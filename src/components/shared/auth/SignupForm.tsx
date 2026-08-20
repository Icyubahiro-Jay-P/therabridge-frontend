import {
  CheckCircle2,
  Eye,
  EyeOff,
  CalendarIcon,
  Loader2,
  TriangleAlert,
} from "lucide-react"
import { useMemo, useState } from "react"
import { subYears } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { FieldName, FieldErrors, Feedback } from "./useSignupState"
import { validateField } from "./useSignupState"
import { STEP_COUNT, STEP_ITEMS } from "./signupSteps"

export function SignupForm({
  form,
  date,
  showPassword,
  feedback: fb,
  fieldErrors: fe,
  isLoading: l,
  stepIndex,
  isLastStep,
  isFirstStep,
  updateField: uf,
  handleBlur: hb,
  setDateOfBirth: sdp,
  handleStepSubmit: hss,
  setShowPassword: sp,
  goToStep,
}: {
  form: Record<FieldName, string>
  date: Date | undefined
  showPassword: boolean
  feedback: Feedback | null
  fieldErrors: FieldErrors
  isLoading: boolean
  stepIndex: number
  isLastStep: boolean
  isFirstStep: boolean
  updateField: (f: FieldName, v: string) => void
  handleBlur: (f: FieldName) => void
  setDateOfBirth: (date: Date) => void
  handleStepSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  goToStep: (index: number) => void
}) {
  const stepItem = STEP_ITEMS[stepIndex]
  const currentValue =
    stepItem.field === "dateOfBirth"
      ? form.dateOfBirth
      : form[stepItem.field]
  const currentError =
    fe[stepItem.field] ?? validateField(stepItem.field, currentValue, date)

  const progress = useMemo(
    () => ((stepIndex + 1) / STEP_COUNT) * 100,
    [stepIndex]
  )

  const [dobOpen, setDobOpen] = useState(false)
  const maxDate = subYears(new Date(), 18)
  const formattedDob = date
    ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : ""

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

      <form onSubmit={hss} noValidate className="space-y-2">
        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Step {stepIndex + 1} of {STEP_COUNT}
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {stepItem.label}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-1.5 py-3">
          <Label htmlFor={stepItem.field} className="text-sm font-medium">
            {stepItem.label}
          </Label>

          {stepItem.field === "dateOfBirth" ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <select
                  id="dob-day"
                  aria-label="Day"
                  value={dobDay ?? ""}
                  disabled={l}
                  onChange={(e) => hdp(e.target.value, dobMonth ?? "", dobYear ?? "")}
                  className={cn(
                    "h-9 w-full cursor-pointer rounded-4xl border border-input bg-input/30 px-3 text-base text-gray-900 outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:text-white",
                    fe.dateOfBirth && "border-red-400 dark:border-red-600"
                  )}
                >
                  <option value="">Day</option>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <select
                  id="dob-month"
                  aria-label="Month"
                  value={dobMonth ?? ""}
                  disabled={l}
                  onChange={(e) => hdp(dobDay ?? "", e.target.value, dobYear ?? "")}
                  className={cn(
                    "h-9 w-full cursor-pointer rounded-4xl border border-input bg-input/30 px-3 text-base text-gray-900 outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:text-white",
                    fe.dateOfBirth && "border-red-400 dark:border-red-600"
                  )}
                >
                  <option value="">Month</option>
                  {MONTH_NAMES.map((name, i) => (
                    <option key={name} value={i + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <select
                  id="dob-year"
                  aria-label="Year"
                  value={dobYear ?? ""}
                  disabled={l}
                  onChange={(e) => hdp(dobDay ?? "", dobMonth ?? "", e.target.value)}
                  className={cn(
                    "h-9 w-full cursor-pointer rounded-4xl border border-input bg-input/30 px-3 text-base text-gray-900 outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:text-white",
                    fe.dateOfBirth && "border-red-400 dark:border-red-600"
                  )}
                >
                  <option value="">Year</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="relative">
              <stepItem.icon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                id={stepItem.field}
                type={stepItem.inputType ?? "text"}
                autoComplete={stepItem.autoComplete}
                placeholder={stepItem.placeholder}
                value={form[stepItem.field]}
                onChange={(e) => uf(stepItem.field, e.target.value)}
                onBlur={() => hb(stepItem.field)}
                disabled={l}
                autoFocus
                className={cn(
                  "pl-9",
                  stepItem.field === "password" && "pr-10",
                  fe[stepItem.field] &&
                    "border-red-400 dark:border-red-600"
                )}
              />

              {stepItem.field === "password" ? (
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

          {currentError && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {currentError}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFirstStep || l}
            onClick={() => goToStep(stepIndex - 1)}
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
