import { Switch } from "@/components/ui/switch"
import { Droplets, EyeOff } from "lucide-react"
import { SettingRow } from "./SettingRow"
import type { Settings } from "./useSettingsState"

interface PrivacySettingsProps {
  settings: Settings
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export function PrivacySettings({
  settings,
  updateSetting,
}: PrivacySettingsProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
        Privacy
      </h2>
      <SettingRow
        icon={EyeOff}
        label="Screenshot protection"
        description="Block screenshots and blur the screen when you switch away from chats"
      >
        <Switch
          checked={settings.screenshotProtection}
          onCheckedChange={(v) =>
            updateSetting("screenshotProtection", v)
          }
        />
      </SettingRow>
      <SettingRow
        icon={Droplets}
        label="Watermark chats"
        description="Overlay your username and a timestamp across chat views"
      >
        <Switch
          checked={settings.watermarkEnabled}
          onCheckedChange={(v) => updateSetting("watermarkEnabled", v)}
        />
      </SettingRow>
    </section>
  )
}
