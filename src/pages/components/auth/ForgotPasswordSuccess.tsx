import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function ForgotPasswordSuccess({ email }: { email: string }) {
  return (
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
  )
}
