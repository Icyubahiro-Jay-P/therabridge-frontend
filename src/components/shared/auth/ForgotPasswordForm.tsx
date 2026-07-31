import { Link } from "react-router-dom"
import { Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ForgotPasswordForm({
  email, sending,
  onEmailChange, onSubmit,
}: {
  email: string; sending: boolean
  onEmailChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <div className="relative mt-1.5">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="email" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => onEmailChange(e.target.value)}
            className="pl-9" required
          />
        </div>
      </div>
      <Button type="submit" disabled={sending || !email.trim()} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {sending ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
          Sign in
        </Link>
      </p>
    </form>
  )
}
