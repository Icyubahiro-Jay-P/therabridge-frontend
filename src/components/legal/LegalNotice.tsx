import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

const linkClass =
  "underline decoration-gray-300 underline-offset-2 transition-colors hover:text-emerald-600 hover:decoration-emerald-500 dark:decoration-gray-600 dark:hover:text-emerald-400"

export function LegalNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-center text-xs leading-relaxed text-gray-400 dark:text-gray-500",
        className
      )}
    >
      By continuing, you agree to our{" "}
      <Link to="/terms" className={linkClass}>
        Terms of Service
      </Link>
      ,{" "}
      <Link to="/privacy" className={linkClass}>
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link to="/cookies" className={linkClass}>
        Cookie Use
      </Link>
      .
    </p>
  )
}
