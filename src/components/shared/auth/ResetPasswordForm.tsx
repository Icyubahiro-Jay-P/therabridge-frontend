import { Key, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ResetPasswordForm({
  password, confirmPassword, resetting,
  onPasswordChange, onConfirmChange, onSubmit,
}: {
  password: string; confirmPassword: string; resetting: boolean
  onPasswordChange: (v: string) => void
  onConfirmChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          New password
        </label>
        <div className="relative mt-1.5">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="password" type="password" placeholder="Min. 8 characters"
            value={password} onChange={(e) => onPasswordChange(e.target.value)}
            className="pl-9" required minLength={8}
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
            id="confirmPassword" type="password" placeholder="Re-enter your password"
            value={confirmPassword} onChange={(e) => onConfirmChange(e.target.value)}
            className="pl-9" required
          />
        </div>
      </div>
      <Button
        type="submit" disabled={resetting || !password || !confirmPassword}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {resetting ? <Loader2 className="size-4 animate-spin" /> : "Reset password"}
      </Button>
    </form>
  )
}
