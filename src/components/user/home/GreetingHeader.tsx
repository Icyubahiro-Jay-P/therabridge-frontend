import { Link } from "react-router-dom"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { User } from "@/types/user"

interface GreetingHeaderProps {
  user: User
}

export function GreetingHeader({ user }: GreetingHeaderProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            Welcome Back
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {user.firstName}, your wellbeing dashboard is ready.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Continue your progress with curated sessions, quick support access,
            and a clean view of what matters most today.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" className="font-semibold">
            <Link to="/chat">
              <MessageCircle className="size-4" />
              Open Chat
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Link to="/profile">
              View Profile <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
