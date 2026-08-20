import { Link, Navigate } from "react-router-dom"
import { Leaf, Sparkles } from "lucide-react"

import { ModeToggle } from "@/components/shared/mode-toggle"
import { OnboardingForm } from "@/components/user/onboarding/OnboardingForm"
import { useAuthStore } from "@/store/auth-store"

export function OnboardingPage() {
  const user = useAuthStore((state) => state.user)

  if (!user?.isAccountVerified) {
    return <Navigate to="/verify-email" replace />
  }
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
                Let's personalise your journey
              </p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-black/30">
          <div className="mb-4 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="size-4" />
            <p className="text-xs font-semibold tracking-wide uppercase">
              Almost there
            </p>
          </div>
          <OnboardingForm />
        </div>
      </div>
    </main>
  )
}
