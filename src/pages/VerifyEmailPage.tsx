import { Link } from "react-router-dom"
import { CheckCircle2, Leaf, ShieldCheck } from "lucide-react"

import { ModeToggle } from "@/components/shared/mode-toggle"
import { VerifyEmailForm } from "@/components/shared/auth/VerifyEmailForm"
import { useAuthStore } from "@/store/auth-store"

export function VerifyEmailPage() {
  const user = useAuthStore((state) => state.user)
  const alreadyVerified = user?.isAccountVerified

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
            Verify your email
          </h1>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            {alreadyVerified
              ? "Your account is already verified. Welcome aboard!"
              : "We sent a 6-digit code to your email to confirm your account."}
          </p>

          {alreadyVerified ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" />
              </span>
              <Link
                to="/"
                className="rounded-4xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
              >
                Go to your dashboard
              </Link>
            </div>
          ) : (
            <VerifyEmailForm />
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <ShieldCheck className="size-3.5" />
          We'll never share your email address.
        </div>
      </div>
    </main>
  )
}
