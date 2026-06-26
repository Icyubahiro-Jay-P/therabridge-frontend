import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Eye, MessageCircle, Trash2 } from "lucide-react"
import { DangerModal } from "./DangerModal"
import { SettingRow } from "./SettingRow"
import { ReadReceiptsToggle } from "./ReadReceiptsToggle"
import type { Settings } from "./useSettingsState"

interface ChatSettingsProps {
  settings: Settings
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  modal: string | null
  setModal: (m: "dm" | "community" | "account" | null) => void
  deletingDMs: boolean
  deletingCommunity: boolean
  deleteDMs: () => void
  deleteCommunityMessages: () => void
  closeModal: () => void
}

export function ChatSettings({
  settings, updateSetting, modal, setModal,
  deletingDMs, deletingCommunity, deleteDMs, deleteCommunityMessages, closeModal
}: ChatSettingsProps) {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Messaging</h2>
        <SettingRow icon={Eye} label="Message previews" description="Show message content in conversation list">
          <Switch checked={settings.messagePreviews} onCheckedChange={(v) => updateSetting("messagePreviews", v)} />
        </SettingRow>
        <SettingRow icon={MessageCircle} label="Read receipts" description="Let others see when you've read their messages">
          <ReadReceiptsToggle />
        </SettingRow>
        <SettingRow icon={MessageCircle} label="Enter to send" description="Press Enter to send, Shift+Enter for new line">
          <Switch checked={settings.enterToSend} onCheckedChange={(v) => updateSetting("enterToSend", v)} />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-red-500">Danger Zone</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 px-4 py-3.5 dark:border-red-900/50">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <Trash2 className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Delete all direct messages</p>
                <p className="text-xs text-gray-400">Remove every DM you've sent or received</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setModal("dm")} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">Delete</Button>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 px-4 py-3.5 dark:border-red-900/50">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <Trash2 className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Delete all community messages</p>
                <p className="text-xs text-gray-400">Remove every message you've sent in communities</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setModal("community")} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">Delete</Button>
          </div>
        </div>
      </section>

      <DangerModal open={modal === "dm"} title="Delete all direct messages?" description="This action cannot be undone. All your private messages will be permanently removed." confirmLabel="Delete Messages" confirmInputLabel="Type DELETE to confirm" requiredInput="DELETE" loading={deletingDMs} onConfirm={deleteDMs} onCancel={closeModal} />
      <DangerModal open={modal === "community"} title="Delete all community messages?" description="This action cannot be undone. All your community messages will be permanently removed." confirmLabel="Delete Messages" confirmInputLabel="Type DELETE to confirm" requiredInput="DELETE" loading={deletingCommunity} onConfirm={deleteCommunityMessages} onCancel={closeModal} />
    </>
  )
}
