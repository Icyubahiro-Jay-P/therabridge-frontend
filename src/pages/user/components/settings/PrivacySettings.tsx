import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { EyeOff, TriangleAlert } from "lucide-react"
import { DeleteAccountModal } from "./DeleteAccountModal"
import { SettingRow } from "./SettingRow"
import type { Settings } from "./useSettingsState"

interface PrivacySettingsProps {
  settings: Settings
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  modal: string | null
  setModal: (m: "dm" | "community" | "account" | null) => void
  deletingAccount: boolean
  deleteAccount: () => void
  closeModal: () => void
}

export function PrivacySettings({
  settings, updateSetting, modal, setModal,
  deletingAccount, deleteAccount, closeModal
}: PrivacySettingsProps) {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Privacy</h2>
        <SettingRow icon={EyeOff} label="Screenshot protection" description="Blur screen when switching away from communities">
          <Switch checked={settings.communityScreenshotProtection} onCheckedChange={(v) => updateSetting("communityScreenshotProtection", v)} />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-red-500">Danger Zone</h2>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 px-4 py-3.5 dark:border-red-900/50">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <TriangleAlert className="size-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Delete account</p>
              <p className="text-xs text-gray-400">Permanently remove your account and all data</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setModal("account")} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">Delete</Button>
        </div>
      </section>

      <DeleteAccountModal open={modal === "account"} onConfirm={deleteAccount} onCancel={closeModal} loading={deletingAccount} />
    </>
  )
}
