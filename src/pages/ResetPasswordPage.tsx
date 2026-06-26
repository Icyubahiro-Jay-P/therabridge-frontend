import { useState } from "react"
import { useParams } from "react-router-dom"
import { Leaf, TriangleAlert } from "lucide-react"

import { api } from "@/lib/api"
import { InvalidToken } from "@/pages/components/auth/InvalidToken"
import { ResetPasswordForm } from "@/pages/components/auth/ResetPasswordForm"
import { ResetPasswordSuccess } from "@/pages/components/auth/ResetPasswordSuccess"

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

  if (!token) return <InvalidToken />

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
            <ResetPasswordSuccess />
          ) : (
            <ResetPasswordForm
              password={password}
              confirmPassword={confirmPassword}
              resetting={resetting}
              onPasswordChange={setPassword}
              onConfirmChange={setConfirmPassword}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
