import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AtSign,
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

type FieldName = "firstName" | "lastName" | "username" | "email" | "password" | "dateOfBirth"
type FieldErrors = Partial<Record<FieldName, string>>
type Feedback = { type: "success" | "error"; message: string }

function validate(form: Record<FieldName, string>): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.firstName.trim() || form.firstName.trim().length < 2)
    errors.firstName = "First name must be at least 2 characters."
  if (!form.lastName.trim() || form.lastName.trim().length < 2)
    errors.lastName = "Last name must be at least 2 characters."
  if (!form.username.trim()) {
    errors.username = "Username is required."
  } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username.trim())) {
    errors.username = "Letters, numbers, underscores only (3–30 chars)."
  }
  if (!form.email.trim()) {
    errors.email = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Invalid email format."
  }
  if (!form.password) {
    errors.password = "Password is required."
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters."
  }
  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required."
  } else {
    const today = new Date()
    const birthDate = new Date(form.dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 18 || age > 120) errors.dateOfBirth = "You must be between 18 and 120 years old."
  }
  return errors
}

export function SignupPage() {
  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
  })

  const [date, setDate] = useState<Date | undefined>()
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})

  function updateField(field: FieldName, value: string) {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (touched[field]) setFieldErrors(validate(next))
      return next
    })
  }

  function handleBlur(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFieldErrors(validate(form))
  }

  function handleDateSelect(selectedDate: Date | undefined) {
    setDate(selectedDate)
    const value = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
    const next = { ...form, dateOfBirth: value }
    setForm(next)
    if (touched.dateOfBirth) setFieldErrors(validate(next))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    const errors = validate(form)
    setFieldErrors(errors)
    setTouched({ firstName: true, lastName: true, username: true, email: true, password: true, dateOfBirth: true })
    if (Object.keys(errors).length > 0) return

    try {
      const message = await register(form)
      setFeedback({ type: "success", message })
      window.setTimeout(() => navigate("/"), 900)
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Registration failed",
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
            Create your account
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Join Therabridge. You must be 18 or older to register.
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
              <span className="shrink-0">
                {feedback.type === "error" ? "⚠️" : "✅"}
              </span>
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    onBlur={() => handleBlur("firstName")}
                    required
                    minLength={2}
                    disabled={isLoading}
                    className={cn("pl-9", fieldErrors.firstName && "border-red-400 dark:border-red-600")}
                  />
                </div>
                {fieldErrors.firstName && (
                  <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  required
                  minLength={2}
                  disabled={isLoading}
                  className={cn(fieldErrors.lastName && "border-red-400 dark:border-red-600")}
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <AtSign className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="username"
                  value={form.username}
                  onChange={(e) => updateField("username", e.target.value)}
                  onBlur={() => handleBlur("username")}
                  required
                  minLength={3}
                  pattern="[a-zA-Z0-9_]{3,30}"
                  title="Letters, numbers, and underscores only (3–30 chars)"
                  disabled={isLoading}
                  className={cn("pl-9", fieldErrors.username && "border-red-400 dark:border-red-600")}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  required
                  disabled={isLoading}
                  className={cn("pl-9", fieldErrors.email && "border-red-400 dark:border-red-600")}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Date of Birth - Shadcn Calendar with dropdowns */}
            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "relative w-full justify-start text-left font-normal pl-9",
                      !date && "text-muted-foreground",
                      fieldErrors.dateOfBirth && "border-red-400 dark:border-red-600"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    captionLayout="dropdown"  
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              {fieldErrors.dateOfBirth && (
                <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.dateOfBirth}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  required
                  minLength={8}
                  disabled={isLoading}
                  className={cn("pl-9 pr-10", fieldErrors.password && "border-red-400 dark:border-red-600")}
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
                <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.password}</p>
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
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}