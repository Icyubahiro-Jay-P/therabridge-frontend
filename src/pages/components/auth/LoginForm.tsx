import { Eye, EyeOff, Loader2, Lock, Mail, TriangleAlert, CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FieldErrors, Feedback } from "./useLoginState"

export function LoginForm({
  identifier, password, showPassword, feedback, fieldErrors, isLoading,
  onIdentifierChange, onPasswordChange, onBlur, onSubmit, setShowPassword,
}: {
  identifier: string; password: string; showPassword: boolean
  feedback: Feedback | null; fieldErrors: FieldErrors; isLoading: boolean
  onIdentifierChange: (v: string) => void; onPasswordChange: (v: string) => void
  onBlur: (f: "identifier" | "password") => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const Err = (e: string | undefined) =>
    e ? <p className="text-xs text-red-500 dark:text-red-400">{e}</p> : null

  return (<>
    {feedback && (
      <div
        role="alert"
        className={cn(
          "mb-5 flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium",
          feedback.type === "error"
            ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
            : "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
        )}
      >
        <span className="shrink-0">
          {feedback.type === "error" ? <TriangleAlert size={18} /> : <CircleCheck size={18} />}
        </span>
        <span>{feedback.message}</span>
      </div>
    )}
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="identifier" className="text-sm font-medium">Email or username</Label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="identifier" autoComplete="username" placeholder="Email or username"
            value={identifier} onChange={(e) => onIdentifierChange(e.target.value)}
            onBlur={() => onBlur("identifier")} required disabled={isLoading}
            className={cn("pl-9", fieldErrors.identifier && "border-red-400 dark:border-red-600")}
          />
        </div>
        {Err(fieldErrors.identifier)}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
            placeholder="••••••••" value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={() => onBlur("password")} required minLength={8} disabled={isLoading}
            className={cn("pl-9 pr-10", fieldErrors.password && "border-red-400 dark:border-red-600")}
          />
          <button
            type="button" onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {Err(fieldErrors.password)}
      </div>

      <Button
        type="submit" disabled={isLoading}
        className="mt-2 w-full bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
      >
        {isLoading ? (
          <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" />Signing in…</span>
        ) : "Sign in"}
      </Button>
    </form>
  </>)
}
