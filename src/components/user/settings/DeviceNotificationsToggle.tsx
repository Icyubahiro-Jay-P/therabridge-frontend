import { useEffect, useState } from "react"
import { Smartphone } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SettingRow } from "@/components/user/settings/SettingRow"
import {
  enablePush,
  disablePush,
  getPushPermission,
  isPushSupported,
  SW_PATH,
  type PushPermission,
} from "@/lib/push"

export function DeviceNotificationsToggle() {
  const [permission, setPermission] = useState<PushPermission>(() =>
    getPushPermission()
  )
  const [subscribed, setSubscribed] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function checkSubscription() {
      if (!isPushSupported()) return
      try {
        const registration = await navigator.serviceWorker.getRegistration(
          SW_PATH
        )
        const sub = registration
          ? await registration.pushManager.getSubscription()
          : null
        if (!cancelled) setSubscribed(!!sub)
      } catch {
        // best-effort - leave state as-is
      }
    }
    void checkSubscription()
    return () => {
      cancelled = true
    }
  }, [])

  const enabled = permission === "granted" && subscribed
  const unsupported = permission === "unsupported"

  async function handleToggle(next: boolean) {
    if (busy) return
    setBusy(true)
    try {
      if (next) {
        const result = await enablePush()
        setPermission(result)
        if (result === "granted") setSubscribed(true)
      } else {
        await disablePush()
        setSubscribed(false)
      }
    } finally {
      setBusy(false)
    }
  }

  const description = unsupported
    ? "Your browser doesn't support push notifications"
    : permission === "denied"
      ? "Blocked by your browser - allow notifications in the site settings"
      : "Get alerts on this device for messages & activity"

  return (
    <SettingRow
      icon={Smartphone}
      label="Device notifications"
      description={description}
    >
      <Switch
        checked={enabled}
        disabled={unsupported || permission === "denied" || busy}
        onCheckedChange={handleToggle}
      />
    </SettingRow>
  )
}
