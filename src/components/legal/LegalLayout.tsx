import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"

import { ModeToggle } from "@/components/shared/mode-toggle"

export function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string
  updated: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <main className="h-svh overflow-y-auto bg-linear-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
      <header className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/75 backdrop-blur dark:border-gray-800 dark:bg-gray-950/75">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25">
              <Leaf className="size-5 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Therabridge
            </span>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
        <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
          Therabridge
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {intro}
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Last updated: {updated}
        </p>

        <div className="mt-12 space-y-12">{children}</div>
      </div>

      <footer className="border-t border-gray-200/70 bg-white/60 dark:border-gray-800 dark:bg-gray-950/40">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Therabridge. All rights reserved.
          </p>
          <nav className="flex items-center gap-5 text-xs font-medium">
            <Link
              to="/terms"
              className="text-gray-500 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-500 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookies"
              className="text-gray-500 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              Cookie Use
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
