import {
  Bell,
  Flame,
  HeartPulse,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { ModeToggle } from "@/components/shared/mode-toggle"
import { LoginForm } from "@/components/shared/auth/LoginForm"
import { LoginFooter } from "@/components/shared/auth/LoginFooter"
import { useLoginState } from "@/components/shared/auth/useLoginState"
import { LegalNotice } from "@/components/legal/LegalNotice"

function PhoneMockup() {
  const moods = [
    { color: "bg-emerald-500", label: "Great" },
    { color: "bg-teal-400", label: "Good" },
    { color: "bg-amber-400", label: "Okay" },
    { color: "bg-orange-500", label: "Low" },
    { color: "bg-rose-500", label: "Heavy" },
  ]

  return (
    <div
      className="mockup-phone animate-float-y w-full max-w-90 max-h-160"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mockup-phone-camera"></div>
      <div className="mockup-phone-display">
        <div className="flex h-full w-full flex-col bg-linear-to-br from-emerald-50 via-white to-teal-50 px-6 pt-14 pb-7 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/40">
          <div className="grid grid-cols-3 items-center">
            <span className="justify-self-start text-[10px] font-medium tracking-wide text-gray-400">
              9:41
            </span>
            <span className="flex items-center justify-center gap-1 rounded-full bg-emerald-100/80 px-2 py-1 dark:bg-emerald-900/50">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-300">
                Therry is here
              </span>
            </span>
            <span
              className="flex items-center justify-self-end gap-1.5"
              aria-hidden="true"
            >
              <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="size-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="size-1.5 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                A
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Good morning, Alex
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  How are you feeling?
                </p>
              </div>
            </div>
            <span className="relative flex size-9 items-center justify-center rounded-full bg-white/70 shadow-sm dark:bg-gray-800">
              <Bell className="size-4 text-gray-500 dark:text-gray-400" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-rose-500" />
            </span>
          </div>

          <div className="mt-8 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800/70 dark:ring-white/5">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Log your mood
            </p>
            <div
              className="mt-3 flex items-center justify-between"
              aria-hidden="true"
            >
              {moods.map((m, i) => (
                <span
                  key={m.label}
                  className={`size-7 rounded-full ${m.color} ${
                    i === 2
                      ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-3xl rounded-bl-lg bg-white p-5 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3" /> Therry
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              &ldquo;It&rsquo;s okay to have a heavy day. Want to talk it
              through?&rdquo;
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-3xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800/70 dark:ring-white/5">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                <Flame className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  4 day streak
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  One check-in at a time
                </p>
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

const featureTiles = [
  {
    icon: MessageCircle,
    label: "Therapist DMs",
    hint: "1:1, private",
  },
  {
    icon: Sparkles,
    label: "Therry AI",
    hint: "support 24/7",
  },
  {
    icon: HeartPulse,
    label: "Mood tracking",
    hint: "daily check-ins",
  },
]

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
    <main className="relative h-svh overflow-x-hidden overflow-y-auto bg-linear-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-32 size-136 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -bottom-40 -left-32 size-120 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/10" />
      </div>

      <div className="fixed top-5 right-5 z-20">
        <ModeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-20 px-6 py-16 sm:px-10 sm:py-20 md:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-24 lg:px-14 lg:py-10">
        <section className="relative hidden md:flex md:items-center md:justify-center md:-translate-y-11 lg:-translate-y-12">
          <PhoneMockup />
        </section>

        <section className="animate-rise-in mx-auto w-full max-w-md">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="inline-flex size-16 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <Leaf className="size-8 text-white" />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Therabridge
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your mental wellness companion
              </p>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-balance text-3xl leading-tight font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A bridge to feeling like yourself again
            </h1>
            <p className="mx-auto mt-5 max-w-sm text-pretty text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Private chats with your therapist, a 24/7 AI companion, mood
              tracking, and gentle daily check-ins in one calm, secure place.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 md:hidden">
            {featureTiles.map((tile) => (
              <div
                key={tile.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200/80 bg-white/70 px-2 py-4 text-center backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/70"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <tile.icon className="size-4" />
                </span>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                  {tile.label}
                </p>
                <p className="text-[10px] text-gray-400">{tile.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200/80 bg-white/80 p-7 shadow-xl shadow-gray-200/40 backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-black/30 sm:p-9">
            <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
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

          <div className="mt-3 rounded-3xl border border-gray-200/80 bg-white/60 p-5 text-center backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/60">
            <LoginFooter />
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <ShieldCheck className="size-3.5" />
              Your conversations are private and encrypted.
            </div>
            <LegalNotice />
          </div>
        </section>
      </div>
    </main>
  )
}
