import { CheckCircle2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CrisisAlertSuccess({
  resources,
  onReset,
}: {
  resources: string[]
  onReset: () => void
}) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
      <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
      <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">Help is on the way</h2>
      <p className="mt-1 text-sm text-gray-500">Your alert has been sent to our support team.</p>
      {resources.length > 0 && (
        <div className="mt-4 text-left">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Resources for you:</p>
          <ul className="space-y-1">
            {resources.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Heart className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button onClick={onReset} variant="outline" className="mt-4">
        Send another alert
      </Button>
    </div>
  )
}
