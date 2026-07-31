import { Switch } from "@/components/ui/switch"
import { Eye, MessageCircle } from "lucide-react"
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
  settings,
  updateSetting,
  modal,
  deletingDMs,
  deletingCommunity,
  deleteDMs,
  deleteCommunityMessages,
  closeModal,
}: ChatSettingsProps) {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Messaging
        </h2>
        <SettingRow
          icon={Eye}
          label="Message previews"
          description="Show message content in conversation list"
        >
          <Switch
            checked={settings.messagePreviews}
            onCheckedChange={(v) => updateSetting("messagePreviews", v)}
          />
        </SettingRow>
        <SettingRow
          icon={MessageCircle}
          label="Read receipts"
          description="Let others see when you've read their messages"
        >
          <ReadReceiptsToggle />
        </SettingRow>
        <SettingRow
          icon={MessageCircle}
          label="Enter to send"
          description="Press Enter to send, Shift+Enter for new line"
        >
          <Switch
            checked={settings.enterToSend}
            onCheckedChange={(v) => updateSetting("enterToSend", v)}
          />
        </SettingRow>
      </section>

      <DangerModal
        open={modal === "dm"}
        title="Delete all direct messages?"
        description="This action cannot be undone. All your private messages will be permanently removed."
        confirmLabel="Delete Messages"
        confirmInputLabel="Type DELETE to confirm"
        requiredInput="DELETE"
        loading={deletingDMs}
        onConfirm={deleteDMs}
        onCancel={closeModal}
      />
      <DangerModal
        open={modal === "community"}
        title="Delete all community messages?"
        description="This action cannot be undone. All your community messages will be permanently removed."
        confirmLabel="Delete Messages"
        confirmInputLabel="Type DELETE to confirm"
        requiredInput="DELETE"
        loading={deletingCommunity}
        onConfirm={deleteCommunityMessages}
        onCancel={closeModal}
      />
    </>
  )
}
