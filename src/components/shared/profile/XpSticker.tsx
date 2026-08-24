import { Star } from "lucide-react"

interface Props {
  score?: number | null
  className?: string
}

export function XpSticker({ score, className }: Props) {
  if (score == null || score <= 0) return null

  return (
    <span
      title="Wellness points"
      aria-label={`Wellness points: ${score.toLocaleString()}`}
      className={`inline-flex w-fit -rotate-2 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm transition-transform duration-200 ease-out hover:scale-105 hover:rotate-0 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 ${
        className ?? ""
      }`}
    >
      <Star
        className="size-3.5 fill-amber-400 text-amber-400 dark:fill-amber-300 dark:text-amber-300"
        aria-hidden
      />
      <span className="tabular-nums">{score.toLocaleString()}</span>
    </span>
  )
}
