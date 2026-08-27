import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useBillingStatus, useCreateCheckout, useCancelSubscription } from "@/lib/query-hooks"
import { getErrorMessage } from "@/lib/errors"

function fmtWhen(iso?: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function money(amount?: number, currency?: string): string {
  if (amount == null) return "—"
  const sym = currency === "usd" ? "$" : `${(currency ?? "usd").toUpperCase()} `
  return `${sym}${(amount / 100).toFixed(2)}`
}

export function BillingPage() {
  const [searchParams] = useSearchParams()
  const { data, isLoading, isError } = useBillingStatus()
  const checkout = useCreateCheckout()
  const portal = useCancelSubscription()

  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<"subscribe" | "portal" | null>(null)

  const success = searchParams.get("success") === "1"
  const cancelled = searchParams.get("cancelled") === "1"
  const intent = searchParams.get("intent")

  async function handleSubscribe() {
    setError(null)
    setBusy("subscribe")
    try {
      const { checkoutUrl } = await checkout.mutateAsync({ intent: "subscribe" })
      if (checkoutUrl) window.location.href = checkoutUrl
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  async function handlePortal() {
    setError(null)
    setBusy("portal")
    try {
      const { url } = await portal.mutateAsync()
      if (url) window.location.href = url
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  const subscription = data?.subscription
  const payments = data?.payments ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your subscription and per-session payments.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          {intent === "subscribe"
            ? "Your subscription is now active. Welcome aboard!"
            : "Payment successful. Your session is confirmed."}
        </div>
      )}
      {cancelled && (
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          <XCircle className="size-4 shrink-0" />
          The checkout was cancelled. No charge was made.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          Could not load billing information.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" /> Membership
              </p>
              {subscription?.status === "active" ? (
                <>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {subscription.plan ? `${subscription.plan.charAt(0).toUpperCase()}${subscription.plan.slice(1)} plan` : "Active"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Renews {fmtWhen(subscription.cycleEndsAt ?? undefined)}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">No subscription</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Subscribe for perks like priority scheduling and exclusive wellness content.
                  </p>
                </>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Button disabled={busy !== null} onClick={handleSubscribe} className="bg-emerald-600 hover:bg-emerald-700">
                <CreditCard className="size-4" />
                {subscription?.status === "active" ? "Manage plan" : "Subscribe"}
              </Button>
              {subscription?.status === "active" && (
                <Button disabled={busy !== null} variant="outline" onClick={handlePortal}>
                  <ExternalLink className="size-4" /> Billing details
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Payment history
        </h2>
        {payments.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No payments yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
            {payments.map((p) => (
              <li key={p._id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <CreditCard className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium capitalize text-gray-800 dark:text-gray-100">
                    {p.intent === "subscribe" ? "Subscription" : "Therapy session"}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "paid" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
                    >
                      {p.status}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">{fmtWhen(p.createdAt)}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {money(p.amount, p.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}