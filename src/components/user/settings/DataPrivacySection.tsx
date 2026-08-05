import { useState } from "react"
import { Download, Loader2, ShieldCheck } from "lucide-react"
import { api } from "@/lib/api"
import { SettingRow } from "./SettingRow"

// Data privacy controls: export a copy of everything the platform holds about
// the user, plus a summary of encryption/retention behavior. Account deletion
// lives in the Danger Zone section alongside the other destructive actions.
export function DataPrivacySection() {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function download() {
    setDownloading(true)
    setError(null)
    setSuccess(null)
    try {
      const { data } = await api.get("/api/users/export")
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `therabridge-data-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)
      setSuccess("Your data has been downloaded.")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to download your data."
      )
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
        Your Data
      </h2>
      <SettingRow
        icon={Download}
        label="Download my data"
        description="Export everything the platform holds about you as JSON"
      >
        <button
          onClick={download}
          disabled={downloading}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {downloading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Download"
          )}
        </button>
      </SettingRow>
      <SettingRow
        icon={ShieldCheck}
        label="Encryption & retention"
        description="Your messages, mood notes, crisis records, and Therry chats are encrypted at rest. Crisis and audit records are retained for 6 months before they are anonymized."
      >
        {null}
      </SettingRow>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {success && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">{success}</p>
      )}
    </section>
  )
}
