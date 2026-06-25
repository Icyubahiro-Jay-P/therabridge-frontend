import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Key, Leaf, Loader2, Lock, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return "Something went wrong"
}

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetting, setResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) { setError("Invalid reset link"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return }
    if (password !== confirmPassword) { setError("Passwords do not match"); return }

    setResetting(true)
    setError(null)
    try {
      await api.post(`/api/users/reset-password/${token}`, { password })
      setDone(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setResetting(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 p-4 dark:from-gray-950 dark:to-gray-900">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700/60 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <TriangleAlert className="size-6 text-red-600 dark:text-red-400" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid link</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              <ArrowLeft className="size-3.5" /> Request a new link
            </Link>
          </div>
        </div>
      </div>
    )
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
              Reset your password
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose a new password for your account.
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <TriangleAlert className="size-4 shrink-0" /> {error}
            </div>
          )}

          {done ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                <p className="font-medium">Password reset successful!</p>
                <p className="mt-1">You can now sign in with your new password.</p>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm new password
                </label>
                <div className="relative mt-1.5">
                  <Key className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={resetting || !password || !confirmPassword}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {resetting ? <Loader2 className="size-4 animate-spin" /> : "Reset password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
