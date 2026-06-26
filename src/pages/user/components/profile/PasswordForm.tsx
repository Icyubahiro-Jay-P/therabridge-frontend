import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  isLoading: boolean
  passwordMessage: string
  passwordError: string
  passwordForm: { currentPassword: string; newPassword: string; confirmPassword: string }
  onFieldChange: (field: "currentPassword" | "newPassword" | "confirmPassword", value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function PasswordForm({ isLoading, passwordMessage, passwordError, passwordForm, onFieldChange, onSubmit }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Choose a strong password with at least 8 characters.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {passwordMessage && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="size-4 shrink-0" />
              {passwordMessage}
            </p>
          )}
          {passwordError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              {passwordError}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <Input id="current-password" type="password" value={passwordForm.currentPassword} onChange={(e) => onFieldChange("currentPassword", e.target.value)} required disabled={isLoading} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" value={passwordForm.newPassword} onChange={(e) => onFieldChange("newPassword", e.target.value)} required minLength={8} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input id="confirm-password" type="password" value={passwordForm.confirmPassword} onChange={(e) => onFieldChange("confirmPassword", e.target.value)} required minLength={8} disabled={isLoading} />
            </div>
          </div>
          <Button type="submit" variant="outline" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="size-4 animate-spin" />Updating...</span>
            ) : "Update password"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
