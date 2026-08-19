import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Leaf, Loader2, ShieldCheck, TriangleAlert } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"

export function VerifyTwoFactorPage() {
  const navigate = useNavigate()
  const { verifyTwoFactor, pendingTwoFactor, clearPendingTwoFactor, isLoading, error, clearError } =
    useAuthStore()
  const [code, setCode] = useState("")

  if (!pendingTwoFactor) {
    navigate("/login", { replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await verifyTwoFactor(code)
      navigate("/", { replace: true })
    } catch {
      // error is in the store
    }
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
                Your mental wellness companion
              </p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-black/30">
          <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h1>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code from your authenticator app, or a backup code.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="totp-code"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Authentication code
              </label>
              <input
                id="totp-code"
                type="text"
                inputMode="text"
                autoComplete="one-time-code"
                autoFocus
                maxLength={8}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\s/g, ""))
                  if (error) clearError()
                }}
                placeholder="123456"
                disabled={isLoading}
                className="h-12 w-full rounded-xl border border-input bg-input/30 px-3 text-center text-2xl font-bold tracking-[0.3em] text-gray-900 tabular-nums outline-none transition-all focus-visible:border-emerald-500 focus-visible:ring-[3px] focus-visible:ring-emerald-500/40 disabled:opacity-50 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Enter the code from your authenticator app, or an 8-character backup code.
              </p>
            </div>

            <Button
              type="submit"
              disabled={code.length < 6 || isLoading}
              className="w-full bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                clearPendingTwoFactor()
                navigate("/login", { replace: true })
              }}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Back to login
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <ShieldCheck className="size-3.5" />
          Your account is protected with two-factor authentication.
        </div>
      </div>
    </main>
  )
}
