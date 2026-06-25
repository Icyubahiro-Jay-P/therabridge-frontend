import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 px-4 dark:from-gray-950 dark:to-gray-900">
      <span className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-700/30">
        <Leaf className="size-8 text-white" />
      </span>
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="mt-4 text-center text-lg text-gray-500 dark:text-gray-400">
        Oops! This page took a wrong turn.
      </p>
      <p className="mt-1 text-center text-sm text-gray-400 dark:text-gray-500">
        Don't worry, even the best journeys have detours. Let's get you back on track.
      </p>
      <Button asChild className="mt-8 bg-emerald-600 hover:bg-emerald-700">
        <Link to="/">Take me home</Link>
      </Button>
    </div>
  )
}
