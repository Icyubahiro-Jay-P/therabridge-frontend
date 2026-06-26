import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogoutModal({
  open, onConfirm, onCancel, loading,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
        <div className="mb-1 flex size-12 items-center justify-self-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <LogOut className="size-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white text-center">
          Log out?
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to log out? You'll need to sign in again to
          access your account.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-600 text-white hover:bg-red-700">
            {loading ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>
    </div>
  )
}
