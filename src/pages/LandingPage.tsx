import { Link } from "react-router-dom"
import {
  Bell,
  Flame,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { ModeToggle } from "@/components/shared/mode-toggle"
import { LoginForm } from "@/components/shared/auth/LoginForm"
import { LoginFooter } from "@/components/shared/auth/LoginFooter"
import { useLoginState } from "@/components/shared/auth/useLoginState"

function PhoneMockup() {
  const moods = [
    { color: "bg-emerald-500", label: "Great" },
    { color: "bg-teal-400", label: "Good" },
    { color: "bg-amber-400", label: "Okay" },
    { color: "bg-orange-500", label: "Low" },
    { color: "bg-rose-500", label: "Heavy" },
  ]

  return (
    <div className="relative w-[300px] animate-float-y rounded-[3rem] border border-white/70 bg-white/50 p-3 shadow-2xl shadow-emerald-900/20 ring-1 ring-gray-900/5 backdrop-blur dark:border-white/10 dark:bg-gray-900/60 dark:shadow-black/50">
      <div className="absolute top-5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-gray-900/80 dark:bg-gray-950" />
      <div className="overflow-hidden rounded-[2.25rem] bg-linear-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/40">
        <div className="px-5 pt-11 pb-5">
          <div className="flex items-center justify-between text-[10px] font-medium tracking-wide text-gray-400">
            <span>9:41</span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="size-1.5 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                A
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Good morning, Alex
                </p>
                <p className="text-[10px] text-gray-400">How are you feeling?</p>
              </div>
            </div>
            <span className="relative flex size-8 items-center justify-center rounded-full bg-white/70 shadow-sm dark:bg-gray-800">
              <Bell className="size-3.5 text-gray-500 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
            </span>
          </div>

          <div className="mt-5 rounded-2xl bg-white/80 p-3.5 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800/70 dark:ring-white/5">
            <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
              Log your mood
            </p>
            <div className="mt-2.5 flex items-center justify-between" aria-hidden="true">
              {moods.map((m, i) => (
                <span
                  key={m.label}
                  className={`size-6 rounded-full ${m.color} ${
                    i === 2
                      ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-2xl rounded-bl-md bg-white p-3.5 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3" /> Therry
            </p>
            <p className="mt-1.5 text-[11px] leading-snug text-gray-600 dark:text-gray-300">
              &ldquo;It&rsquo;s okay to have a heavy day. Want to talk it
              through?&rdquo;
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800/70 dark:ring-white/5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                <Flame className="size-3.5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-gray-900 dark:text-white">
                  4 day streak
                </p>
                <p className="text-[9px] text-gray-400">One check-in at a time</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <MessageCircle className="size-3" /> New message
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  const {
    identifier,
    password,
    showPassword,
    feedback,
    fieldErrors,
    isLoading,
    handleIdentifierChange,
    handlePasswordChange,
    handleBlur,
    handleSubmit,
    setShowPassword,
  } = useLoginState()

  return (
    <main className="relative min-h-svh overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-32 size-[34rem] rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -bottom-40 -left-32 size-[30rem] rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/10" />
        <div className="absolute top-1/3 left-1/2 size-72 -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl dark:bg-amber-500/5" />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 py-14 lg:grid-cols-2 lg:gap-6 lg:py-8">
        <section className="relative hidden lg:flex lg:items-center lg:justify-center lg:py-10">
          <PhoneMockup />

          <div className="hidden xl:block">
            <div className="absolute top-16 -left-8 flex animate-rise-in items-center gap-2 rounded-full border border-white/60 bg-white/90 py-2 pr-4 pl-2 shadow-lg shadow-emerald-900/10 backdrop-blur dark:border-white/10 dark:bg-gray-900/90">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Therry is here
              </span>
            </div>

            <div className="absolute right-0 bottom-32 flex animate-rise-in items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-lg shadow-emerald-900/10 backdrop-blur dark:border-white/10 dark:bg-gray-900/90">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Private by design
              </span>
            </div>
          </div>

          <p className="mt-12 max-w-xs text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            One calm place for therapy chats, 24/7 AI support, mood tracking,
            and daily check-ins.
          </p>
        </section>

        <section className="mx-auto w-full max-w-md animate-rise-in">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex flex-col items-center gap-3">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                <Leaf className="size-7 text-white" />
              </span>
              <div>
                <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Therabridge
                </p>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Your mental wellness companion
                </p>
              </div>
            </Link>
          </div>

          <h1 className="text-balance text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            A bridge to feeling like yourself again
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-pretty text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Private chats with your therapist, a 24/7 AI companion, mood
            tracking, and gentle daily check-ins — in one calm, secure place.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-black/30 sm:p-8">
            <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              Sign in with your email or username to continue.
            </p>

            <LoginForm
              identifier={identifier}
              password={password}
              showPassword={showPassword}
              feedback={feedback}
              fieldErrors={fieldErrors}
              isLoading={isLoading}
              onIdentifierChange={handleIdentifierChange}
              onPasswordChange={handlePasswordChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              setShowPassword={setShowPassword}
            />
          </div>

          <div className="mt-3 rounded-2xl border border-gray-200/80 bg-white/60 p-4 text-center backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/60">
            <LoginFooter />
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <ShieldCheck className="size-3.5" />
            Your conversations are private and encrypted.
          </div>
        </section>
      </div>
    </main>
  )
}
