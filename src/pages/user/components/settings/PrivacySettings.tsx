import { Switch } from "@/components/ui/switch"
import { EyeOff } from "lucide-react"
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
        description="Blur screen when switching away from communities"
      >
        <Switch
          checked={settings.communityScreenshotProtection}
          onCheckedChange={(v) =>
            updateSetting("communityScreenshotProtection", v)
          }
        />
      </SettingRow>
    </section>
  )
}
