// Web Push helpers: service-worker registration, subscription sync, and the
// device-notifications toggle backing.
import { api } from "@/lib/api"

export const SW_PATH = "/sw.js"

export type PushPermission =
  | "unsupported"
  | "granted"
  | "denied"
  | "default"

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  )
}

export function getPushPermission(): PushPermission {
  if (!isPushSupported()) return "unsupported"
  if (!("Notification" in window)) return "unsupported"
  if (Notification.permission === "granted") return "granted"
  if (Notification.permission === "denied") return "denied"
  return "default"
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  if (!isPushSupported()) throw new Error("Push is not supported in this browser")
  return navigator.serviceWorker.register(SW_PATH)
}

// Enables push on this device: registers the service worker, asks for browser
// permission, and stores the subscription on the server. Returns the new
// permission state so callers can react (e.g. user declined).
export async function enablePush(): Promise<PushPermission> {
  if (!isPushSupported()) return "unsupported"

  if (getPushPermission() === "denied") return "denied"
  if (getPushPermission() === "default") {
    const granted = await Notification.requestPermission()
    if (granted !== "granted") return granted
  }

  const registration = await getRegistration()

  const { data } = await api.get<{ publicKey: string }>(
    "/api/push/vapid-public-key"
  )
  if (!data.publicKey) return "default" // backend has no VAPID key configured yet

  let subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    })
  }

  await api.post("/api/push/subscribe", {
    subscription: subscription.toJSON(),
    userAgent: navigator.userAgent,
  })

  return "granted"
}

// Disables push on this device and removes the stored subscription.
export async function disablePush(): Promise<void> {
  if (!isPushSupported()) return
  const registration = await navigator.serviceWorker.getRegistration(SW_PATH)
  const subscription = registration
    ? await registration.pushManager.getSubscription()
    : null

  if (subscription) {
    try {
      await api.post("/api/push/unsubscribe", {
        endpoint: subscription.endpoint,
      })
    } catch {
      // best-effort - still unsubscribe locally
    }
    await subscription.unsubscribe()
  }
}

// Re-syncs the stored subscription after login/init. Never prompts; only
// wires an already-granted permission (so a returning user doesn't get nagged).
export async function syncPushSubscription(): Promise<void> {
  if (!isPushSupported() || getPushPermission() !== "granted") return
  try {
    await enablePush()
  } catch {
    // Not critical for app startup
  }
}

// Removes this device's subscription and unregisters the service worker so a
// logged-out account can never surface notifications.
export async function unregisterServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return
  const registration = await navigator.serviceWorker.getRegistration(SW_PATH)
  if (!registration) return

  try {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await api.post("/api/push/unsubscribe", { endpoint: subscription.endpoint })
    }
  } catch {
    // best-effort - proceed to unregister locally
  }
  await registration.unregister()
}
