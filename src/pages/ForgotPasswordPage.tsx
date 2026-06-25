import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Leaf, Loader2, Mail, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

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
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                <p className="font-medium">Check your inbox</p>
                <p className="mt-1">
                  If an account with <strong>{email}</strong> exists, you'll receive a password reset link shortly.
                </p>
              </div>
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                <ArrowLeft className="size-3.5" /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={sending || !email.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
              </Button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
