import { Link } from "react-router-dom"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { User } from "@/types/user"

import { getGreeting } from "./useHomeState"

interface GreetingHeaderProps {
  user: User
}

export function GreetingHeader({ user }: GreetingHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700 p-8 text-white shadow-xl shadow-emerald-700/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -right-10 size-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-white/5" />
      </div>
      <div className="relative">
        <p className="text-sm font-medium text-emerald-200">{getGreeting()}</p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight">
          Hi, {user.firstName}!
        </h1>
        <p className="mt-2 max-w-xl text-emerald-100">
          Take a moment for yourself today. Choose a guided exercise below to
          help you breathe, ground, and feel better.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary" className="font-semibold">
            <Link to="/chat">
              <MessageCircle className="size-4" />
              Open Chat
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
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
