import { useRef } from "react"
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  useVerifyEmailState,
  VERIFY_CODE_LENGTH,
} from "./useVerifyEmailState"

export function VerifyEmailForm() {
  const {
    user,
    digits,
    isComplete,
    loading,
    resending,
    error,
    success,
    resendCooldown,
    setDigit,
    handlePaste,
    handleSubmit,
    handleResend,
  } = useVerifyEmailState()

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  function focusNext(index: number) {
    inputRefs.current[index + 1]?.focus()
  }

  function focusPrev(index: number) {
    inputRefs.current[index - 1]?.focus()
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" />
        </span>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Email verified!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Taking you to set up your profile…
        </p>
      </div>
    )
  }

  const cooldownLabel =
    resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Enter the 6-digit code
        </legend>
        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${index + 1}`}
              value={digit}
              disabled={loading}
              onChange={(e) => {
                setDigit(index, e.target.value)
                if (e.target.value) focusNext(index)
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digit && index > 0) {
                  focusPrev(index)
                }
              }}
              onPaste={(e) => {
                e.preventDefault()
                const placed = handlePaste(e.clipboardData.getData("text"))
                if (placed > 0) {
                  focusNext(Math.min(placed, VERIFY_CODE_LENGTH) - 1)
                }
              }}
              className={cn(
                "h-14 w-full min-w-0 rounded-xl border border-input bg-input/30 text-center text-2xl font-bold text-gray-900 tabular-nums outline-none transition-all select-none focus-visible:border-emerald-500 focus-visible:ring-[3px] focus-visible:ring-emerald-500/40 disabled:opacity-50 dark:text-white",
                digit && "border-emerald-500/60"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          We emailed a 6-digit code to{" "}
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </p>
      </fieldset>

      <Button
        type="submit"
        disabled={!isComplete || loading}
        className="w-full bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Verifying…
          </span>
        ) : (
          "Verify account"
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={resending || resendCooldown > 0}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-gray-400 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <RefreshCw className={cn("size-3.5", resending && "animate-spin")} />
          {resending ? "Sending…" : cooldownLabel}
        </button>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Codes expire after 30 minutes.
        </p>
      </div>
    </form>
  )
}
