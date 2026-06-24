import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Leaf, Loader2, Lock, Mail, TriangleAlert, CircleCheck  } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

type FieldErrors = Partial<Record<"identifier" | "password", string>>
type Feedback = { type: "success" | "error"; message: string }

function validate(identifier: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!identifier.trim()) errors.identifier = "Email or username is required."
  if (!password) errors.password = "Password is required."
  else if (password.length < 8) errors.password = "Password must be at least 8 characters."
  return errors
}

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<"identifier" | "password", boolean>>>({})

  function handleBlur(field: keyof FieldErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFieldErrors(validate(identifier, password))
  }

  function handleIdentifierChange(value: string) {
    setIdentifier(value)
    if (touched.identifier) setFieldErrors(validate(value, password))
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    if (touched.password) setFieldErrors(validate(identifier, value))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    const errors = validate(identifier, password)
    setFieldErrors(errors)
    setTouched({ identifier: true, password: true })
    if (Object.keys(errors).length > 0) return

    try {
      const message = await login({ identifier, password })
      setFeedback({ type: "success", message })
      setTimeout(() => {
        navigate("/", { replace: true })
      }, 900)
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Login failed",
      })
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-10 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 size-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/10" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="size-7 text-white" />
            </span>
            <div>
              <p className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Therabridge
              </p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Your mental wellness companion
              </p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-black/30">
          <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Sign in with your email or username to continue.
          </p>

          {/* Feedback banner */}
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
              <span>{feedback.type === "error" ? <TriangleAlert size={18}/> : <CircleCheck size={18}/>}</span>
              <span className="baseline">{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Identifier */}
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-sm font-medium">
                Email or username
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="identifier"
                  autoComplete="username"
                  placeholder="Email or username"
                  value={identifier}
                  onChange={(e) => handleIdentifierChange(e.target.value)}
                  onBlur={() => handleBlur("identifier")}
                  required
                  disabled={isLoading}
                  className={cn("pl-9", fieldErrors.identifier && "border-red-400 dark:border-red-600")}
                />
              </div>
              {fieldErrors.identifier && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fieldErrors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  required
                  minLength={8}
                  disabled={isLoading}
                  className={cn("pr-10 pl-9", fieldErrors.password && "border-red-400 dark:border-red-600")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}