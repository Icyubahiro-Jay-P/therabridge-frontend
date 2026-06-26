import { useState } from "react"
import { Leaf, TriangleAlert } from "lucide-react"

import { api } from "@/lib/api"
import { ForgotPasswordForm } from "@/pages/components/auth/ForgotPasswordForm"
import { ForgotPasswordSuccess } from "@/pages/components/auth/ForgotPasswordSuccess"

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return "Something went wrong"
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    setError(null)
    setSent(false)
    try {
      await api.post("/api/users/forgot-password", { email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 p-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700/60 dark:bg-gray-900">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-600 mb-4">
              <Leaf className="size-6 text-white" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Forgot password?
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="size-4 shrink-0" /> {error}
            </div>
          )}

          {sent ? (
            <ForgotPasswordSuccess email={email} />
          ) : (
            <ForgotPasswordForm
              email={email}
              sending={sending}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
