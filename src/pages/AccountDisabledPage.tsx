import { useNavigate } from "react-router-dom"
import { ShieldOff, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

export function AccountDisabledPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  async function handleLogout() {
    try { await logout() } catch { /* ignore */ }
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-linear-to-br from-red-50 to-orange-50 p-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <ShieldOff className="size-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account disabled</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your account has been disabled by an administrator. You will not be able to access TheraBridge at this time.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            If you believe this is a mistake, please contact support.
          </p>
          <a
            href="mailto:support@therabridge.com"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <Mail className="size-3.5" /> support@therabridge.com
          </a>
        </div>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Back to login
        </Button>
      </div>
    </div>
  )
}
