import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  TriangleAlert,
} from "lucide-react"
import { useMemo } from "react"
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
  handleDateSelect: hds,
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
  handleDateSelect: (d: Date | undefined) => void
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={l}
                  autoFocus
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
