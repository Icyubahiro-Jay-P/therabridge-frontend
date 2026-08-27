import { api } from "@/lib/api"
import type { BillingStatus } from "@/types/sessions"

export async function getBillingStatus(): Promise<BillingStatus> {
  const { data } = await api.get<BillingStatus>("/api/billing/status")
  return data
}

export async function createCheckoutSession(payload: {
  intent: "subscribe" | "session"
  appointmentId?: string
}): Promise<{ checkoutUrl: string }> {
  const { data } = await api.post<{ checkoutUrl: string }>(
    "/api/billing/checkout",
    payload
  )
  return data
}

export async function cancelSubscription(): Promise<{ url: string }> {
  const { data } = await api.post<{ url: string }>("/api/billing/cancel")
  return data
}