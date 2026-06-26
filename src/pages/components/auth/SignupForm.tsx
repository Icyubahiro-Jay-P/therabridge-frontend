import { AtSign, Calendar as CalendarIcon, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, TriangleAlert, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { FieldName, FieldErrors, Feedback } from "./useSignupState"
export function SignupForm({ form, date, showPassword, feedback: fb, fieldErrors: fe, isLoading: l, updateField: uf, handleBlur: hb, handleDateSelect: hds, handleSubmit: hs, setShowPassword: sp }: {
  form: Record<FieldName, string>; date: Date | undefined; showPassword: boolean
  feedback: Feedback | null; fieldErrors: FieldErrors; isLoading: boolean
  updateField: (f: FieldName, v: string) => void; handleBlur: (f: FieldName) => void
  handleDateSelect: (d: Date | undefined) => void; handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const Err = (e: string | undefined) => e ? <p className="text-xs text-red-500 dark:text-red-400">{e}</p> : null; return (<>
    {fb && <div role="alert" className={cn("mb-5 flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium", fb.type === "error"
      ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
      : "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400")}>
      <span className="shrink-0">{fb.type === "error" ? <TriangleAlert className="size-4" /> : <CheckCircle2 className="size-4" />}</span>
      <span>{fb.message}</span>
    </div>}
    <form onSubmit={hs} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
          <div className="relative">
            <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input id="firstName" autoComplete="given-name" placeholder="First name" value={form.firstName}
              onChange={(e) => uf("firstName", e.target.value)} onBlur={() => hb("firstName")}
              required minLength={2} disabled={l} className={cn("pl-9", fe.firstName && "border-red-400 dark:border-red-600")} />
          </div>
          {Err(fe.firstName)}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
          <Input id="lastName" autoComplete="family-name" placeholder="Last name" value={form.lastName}
            onChange={(e) => uf("lastName", e.target.value)} onBlur={() => hb("lastName")}
            required minLength={2} disabled={l} className={cn(fe.lastName && "border-red-400 dark:border-red-600")} />
          {Err(fe.lastName)}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-sm font-medium">Username</Label>
        <div className="relative">
          <AtSign className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input id="username" autoComplete="username" placeholder="username" value={form.username}
            onChange={(e) => uf("username", e.target.value)} onBlur={() => hb("username")}
            required minLength={3} pattern="[a-zA-Z0-9_]{3,30}" title="Letters, numbers, and underscores only (3–30 chars)" disabled={l}
            className={cn("pl-9", fe.username && "border-red-400 dark:border-red-600")} />
        </div>
        {Err(fe.username)}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input id="email" type="email" autoComplete="email" placeholder="Email address" value={form.email}
            onChange={(e) => uf("email", e.target.value)} onBlur={() => hb("email")}
            required disabled={l} className={cn("pl-9", fe.email && "border-red-400 dark:border-red-600")} />
        </div>
        {Err(fe.email)}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={l}
              className={cn("relative w-full justify-start text-left font-normal pl-9", !date && "text-muted-foreground", fe.dateOfBirth && "border-red-400 dark:border-red-600")}>
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={hds} captionLayout="dropdown" disabled={(d) => d > new Date() || d < new Date("1900-01-01")} />
          </PopoverContent>
        </Popover>
        {Err(fe.dateOfBirth)}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password"
            placeholder="Min. 8 characters" value={form.password} onChange={(e) => uf("password", e.target.value)} onBlur={() => hb("password")}
            required minLength={8} disabled={l} className={cn("pl-9 pr-10", fe.password && "border-red-400 dark:border-red-600")} />
          <button type="button" onClick={() => sp((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {Err(fe.password)}
      </div>
      <Button type="submit" disabled={l} className="mt-2 w-full bg-linear-to-r from-emerald-600 to-teal-600 font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700">
        {l ? <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" />Creating account…</span> : "Create account"}
      </Button>
    </form>
  </>) }
