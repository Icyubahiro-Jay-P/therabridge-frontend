import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"

import { ModeToggle } from "@/components/shared/mode-toggle"
import { useSignupState } from "@/components/shared/auth/useSignupState"
import { SignupForm } from "@/components/shared/auth/SignupForm"
import { AuthFooter } from "@/components/shared/auth/AuthFooter"

export function SignupPage() {
  const {
    form,
    date,
    showPassword,
    feedback,
    fieldErrors,
    isLoading,
    stepIndex,
    isLastStep,
    isFirstStep,
    updateField,
    handleBlur,
    handleDateSelect,
    handleStepSubmit,
    setShowPassword,
    goToStep,
  } = useSignupState()

  return (
    <main className="relative box-border flex min-h-screen items-center justify-center overflow-y-auto bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-6 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 size-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/10" />
      </div>

      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="size-7 text-white" />
            </span>
            <div>
              <p className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Therabridge
              </p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Your mental wellness companion
              </p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-black/30">
          <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h1>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Join Therabridge. You must be 18 or older to register.
          </p>

          <SignupForm
            form={form}
            date={date}
            showPassword={showPassword}
            feedback={feedback}
            fieldErrors={fieldErrors}
            isLoading={isLoading}
            stepIndex={stepIndex}
            isLastStep={isLastStep}
            isFirstStep={isFirstStep}
            updateField={updateField}
            handleBlur={handleBlur}
            handleDateSelect={handleDateSelect}
            handleStepSubmit={handleStepSubmit}
            setShowPassword={setShowPassword}
            goToStep={goToStep}
          />

          <AuthFooter />
        </div>
      </div>
    </main>
  )
}
