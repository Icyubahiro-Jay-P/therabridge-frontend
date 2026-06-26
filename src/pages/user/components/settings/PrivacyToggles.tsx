import { useState } from "react"
import { CheckCircle2, Globe, Lock } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import type { PrivacyField } from "@/types/user"

const privacyLabels: Record<PrivacyField, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  dateOfBirth: "Date of birth",
  bio: "Bio",
}

export function PrivacyToggles() {
  const user = useAuthStore((state) => state.user)
  const updatePrivacy = useAuthStore((state) => state.updatePrivacy)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const privacy = user?.privacySettings ?? {
    firstName: "public",
    lastName: "public",
    email: "public",
    dateOfBirth: "public",
    bio: "public",
  }

  const privateCount = Object.values(privacy).filter((v) => v === "private").length

  async function toggle(field: PrivacyField) {
    setMessage("")
    setError("")
    const newValue = privacy[field] === "public" ? "private" : "public"

    if (newValue === "private" && privateCount >= 3) {
      setError("You can hide at most 3 profile fields.")
      return
    }

    try {
      await updatePrivacy({ [field]: newValue })
      setMessage(`${privacyLabels[field]} updated`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700/60 dark:bg-gray-900/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Profile field visibility</p>
        <span className="text-xs text-gray-400">{privateCount}/3 hidden</span>
      </div>
      <p className="text-xs text-gray-400">Toggle which fields are visible on your public profile.</p>

      {message && (
        <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-3.5 shrink-0" />
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="space-y-1">
        {(Object.keys(privacyLabels) as PrivacyField[]).map((field) => (
          <button
            key={field}
            onClick={() => toggle(field)}
            disabled={isLoading}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            <span className="text-gray-700 dark:text-gray-300">{privacyLabels[field]}</span>
            <span className={`flex items-center gap-1.5 text-xs font-medium ${privacy[field] === "public" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {privacy[field] === "public" ? (
                <><Globe className="size-3.5" /> Public</>
              ) : (
                <><Lock className="size-3.5" /> Private</>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
