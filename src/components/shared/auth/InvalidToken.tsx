import { Link } from "react-router-dom"
import { ArrowLeft, TriangleAlert } from "lucide-react"

export function InvalidToken() {
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
