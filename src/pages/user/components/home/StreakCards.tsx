import { Zap, TrendingUp, Flame, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScoreStreak {
  exerciseScore: number
  loginStreak: number
  exerciseStreak: number
  longestLoginStreak: number
  longestExerciseStreak: number
}

interface Meta {
  fill: string
  next: number
  level?: number
  title?: string
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365]

function nextMilestone(value: number): Meta {
  const next = STREAK_MILESTONES.find((m) => m > value) ?? 365
  const prev = [...STREAK_MILESTONES].reverse().find((m) => m <= value) ?? 0
  const progress = next === prev ? 100 : ((value - prev) / (next - prev)) * 100
  return { next, fill: `${progress}%` }
}

function exLevel(score: number): Meta {
  if (score >= 1200) return { level: 7, title: "Legend", fill: "100%", next: 1200 }
  if (score >= 800) return { level: 6, title: "Master", fill: `${((score - 800) / 400) * 100}%`, next: 1200 }
  if (score >= 500) return { level: 5, title: "Expert", fill: `${((score - 500) / 300) * 100}%`, next: 800 }
  if (score >= 300) return { level: 4, title: "Dedicated", fill: `${((score - 300) / 200) * 100}%`, next: 500 }
  if (score >= 150) return { level: 3, title: "Committed", fill: `${((score - 150) / 150) * 100}%`, next: 300 }
  if (score >= 50) return { level: 2, title: "Growing", fill: `${((score - 50) / 100) * 100}%`, next: 150 }
  return { level: 1, title: "Beginner", fill: `${(score / 50) * 100}%`, next: 50 }
}

function streakEmoji(value: number) {
  if (value === 0) return "🌱"
  if (value >= 365) return "👑"
  if (value >= 180) return "🏆"
  if (value >= 90) return "⭐"
  if (value >= 60) return "⚡"
  if (value >= 30) return "🔥"
  if (value >= 14) return "🔥"
  if (value >= 7) return "🔥"
  if (value >= 3) return "💪"
  return "🌱"
}

function streakLabel(value: number) {
  if (value === 0) return "Start your streak"
  if (value >= 365) return "Legendary"
  if (value >= 180) return "Phenomenal"
  if (value >= 90) return "Outstanding"
  if (value >= 60) return "Strong"
  if (value >= 30) return "Dedicated"
  if (value >= 14) return "Committed"
  if (value >= 7) return "On Fire"
  if (value >= 3) return "Getting Started"
  return "Just Beginning"
}

const cardStyles = [
  { border: "border-amber-200/60 dark:border-amber-800/40", from: "from-amber-50", via: "via-amber-50/80", to: "to-orange-50/50", darkFrom: "dark:from-amber-950/30", darkVia: "dark:via-amber-900/20", darkTo: "dark:to-orange-950/20", iconBg: "bg-amber-100 dark:bg-amber-900/50", iconColor: "text-amber-600 dark:text-amber-400", textColor: "text-amber-700 dark:text-amber-300", labelColor: "text-amber-600 dark:text-amber-400", barBg: "bg-amber-200 dark:bg-amber-800/50", barFill: "bg-amber-500" },
  { border: "border-emerald-200/60 dark:border-emerald-800/40", from: "from-emerald-50", via: "via-emerald-50/80", to: "to-teal-50/50", darkFrom: "dark:from-emerald-950/30", darkVia: "dark:via-emerald-900/20", darkTo: "dark:to-teal-950/20", iconBg: "bg-emerald-100 dark:bg-emerald-900/50", iconColor: "text-emerald-600 dark:text-emerald-400", textColor: "text-emerald-700 dark:text-emerald-300", labelColor: "text-emerald-600 dark:text-emerald-400", barBg: "bg-emerald-200 dark:bg-emerald-800/50", barFill: "bg-emerald-500" },
  { border: "border-sky-200/60 dark:border-sky-800/40", from: "from-sky-50", via: "via-sky-50/80", to: "to-blue-50/50", darkFrom: "dark:from-sky-950/30", darkVia: "dark:via-sky-900/20", darkTo: "dark:to-blue-950/20", iconBg: "bg-sky-100 dark:bg-sky-900/50", iconColor: "text-sky-600 dark:text-sky-400", textColor: "text-sky-700 dark:text-sky-300", labelColor: "text-sky-600 dark:text-sky-400", barBg: "bg-sky-200 dark:bg-sky-800/50", barFill: "bg-sky-500" },
  { border: "border-violet-200/60 dark:border-violet-800/40", from: "from-violet-50", via: "via-violet-50/80", to: "to-purple-50/50", darkFrom: "dark:from-violet-950/30", darkVia: "dark:via-violet-900/20", darkTo: "dark:to-purple-950/20", iconBg: "bg-violet-100 dark:bg-violet-900/50", iconColor: "text-violet-600 dark:text-violet-400", textColor: "text-violet-700 dark:text-violet-300", labelColor: "text-violet-600 dark:text-violet-400", barBg: "bg-violet-200 dark:bg-violet-800/50", barFill: "bg-violet-500" },
]

export function StreakCards({ scoreStreak }: { scoreStreak: ScoreStreak }) {
  const best = Math.max(scoreStreak.longestLoginStreak, scoreStreak.longestExerciseStreak)

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Progress</h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {exLevel(scoreStreak.exerciseScore).title}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          { label: "EX Score", value: scoreStreak.exerciseScore, unit: "pts", Icon: Zap, meta: exLevel(scoreStreak.exerciseScore) },
          { label: "Exercise Streak", value: scoreStreak.exerciseStreak, unit: scoreStreak.exerciseStreak === 1 ? "day" : "days", Icon: TrendingUp, meta: nextMilestone(scoreStreak.exerciseStreak), emoji: streakEmoji(scoreStreak.exerciseStreak), tier: streakLabel(scoreStreak.exerciseStreak) },
          { label: "Login Streak", value: scoreStreak.loginStreak, unit: scoreStreak.loginStreak === 1 ? "day" : "days", Icon: Flame, meta: nextMilestone(scoreStreak.loginStreak), emoji: streakEmoji(scoreStreak.loginStreak), tier: streakLabel(scoreStreak.loginStreak) },
          { label: "Best Streak", value: best, unit: "days", Icon: Layers, meta: nextMilestone(best), emoji: streakEmoji(best), tier: streakLabel(best) },
        ] as const).map((card, i) => {
          const s = cardStyles[i]
          const meta = card.meta
          return (
            <div
              key={card.label}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg",
                "bg-linear-to-br",
                s.from, s.via, s.to,
                s.darkFrom, s.darkVia, s.darkTo,
                s.border,
              )}
            >
              <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-white/40 dark:bg-white/5" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 size-20 rounded-full bg-white/30 dark:bg-white/5" />

              <div className="relative flex items-start justify-between">
                <div className={cn("flex size-10 items-center justify-center rounded-xl", s.iconBg)}>
                  <card.Icon className={cn("size-5", s.iconColor)} />
                </div>
                {"emoji" in card && (
                  <span className="select-none text-xl opacity-80 transition-transform duration-300 group-hover:scale-125">
                    {card.emoji}
                  </span>
                )}
              </div>

              <div className="relative mt-4">
                <p className={cn("text-xs font-medium tracking-wide uppercase", s.labelColor)}>
                  {card.label}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className={cn("text-3xl font-bold tracking-tight", s.textColor)}>
                    {card.value}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">{card.unit}</span>
                </div>

                {meta.level !== undefined ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        Lvl.{meta.level} {meta.title}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {scoreStreak.exerciseScore}/{meta.next} pts
                      </span>
                    </div>
                    <div className={cn("mt-1.5 h-2 overflow-hidden rounded-full", s.barBg)}>
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", s.barFill)}
                        style={{ width: meta.fill }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        {"tier" in card ? card.tier : ""}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        {card.value}/{meta.next} days
                      </span>
                    </div>
                    <div className={cn("mt-1.5 h-2 overflow-hidden rounded-full", s.barBg)}>
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", s.barFill)}
                        style={{ width: meta.fill }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
