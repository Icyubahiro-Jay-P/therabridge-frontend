import { TriangleAlert, User, Sun, Moon, Bell, Fingerprint } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useSettingsState } from "./components/settings/useSettingsState"
import { ChatSettings } from "./components/settings/ChatSettings"
import { PrivacySettings } from "./components/settings/PrivacySettings"
import { SettingRow } from "./components/settings/SettingRow"
import { PrivacyToggles } from "./components/settings/PrivacyToggles"
import { DeleteAccountModal } from "./components/settings/DeleteAccountModal"

export function SettingsPage() {
  const {
    settings,
    updateSetting,
    modal,
    setModal,
    closeModal,
    deletingDMs,
    deletingCommunity,
    deletingAccount,
    deleteDMs,
    deleteCommunityMessages,
    deleteAccount,
    serverError,
    success,
  } = useSettingsState()

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {serverError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {serverError}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
          {success}
        </div>
      )}

      <ChatSettings
        settings={settings}
        updateSetting={updateSetting}
        modal={modal}
        setModal={setModal}
        deletingDMs={deletingDMs}
        deletingCommunity={deletingCommunity}
        deleteDMs={deleteDMs}
        deleteCommunityMessages={deleteCommunityMessages}
        closeModal={closeModal}
      />

      <PrivacySettings settings={settings} updateSetting={updateSetting} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Privacy & Visibility
        </h2>
        <SettingRow
          icon={User}
          label="Account visibility"
          description="Let other users see your profile"
        >
          <select
            value={settings.accountVisibility}
            onChange={(e) =>
              updateSetting(
                "accountVisibility",
                e.target.value as "visible" | "anonymous"
              )
            }
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="visible">Visible</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </SettingRow>
        <PrivacyToggles />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Appearance
        </h2>
        <SettingRow icon={Sun} label="Font size">
          <select
            value={settings.fontSize}
            onChange={(e) =>
              updateSetting("fontSize", e.target.value as "normal" | "large")
            }
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
          </select>
        </SettingRow>
        <SettingRow
          icon={Moon}
          label="Calm mode"
          description="Green-tinted low-contrast theme for relaxation"
        >
          <Switch
            checked={settings.calmMode}
            onCheckedChange={(v) => updateSetting("calmMode", v)}
          />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Notifications
        </h2>
        <SettingRow
          icon={Bell}
          label="Sound effects"
          description="Play sounds for incoming messages"
        >
          <Switch
            checked={settings.soundEnabled}
            onCheckedChange={(v) => updateSetting("soundEnabled", v)}
          />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Focus
        </h2>
        <SettingRow
          icon={Fingerprint}
          label="Focus mode"
          description="Hide distracting UI elements"
        >
          <Switch
            checked={settings.focusMode}
            onCheckedChange={(v) => updateSetting("focusMode", v)}
          />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-red-500 uppercase">
          Danger Zone
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 px-4 py-3.5 dark:border-red-900/50">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <TriangleAlert className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Delete all direct messages
                </p>
                <p className="text-xs text-gray-400">
                  Remove every DM you've sent or received
                </p>
              </div>
            </div>
            <button
              onClick={() => setModal("dm")}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 px-4 py-3.5 dark:border-red-900/50">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <TriangleAlert className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Delete all community messages
                </p>
                <p className="text-xs text-gray-400">
                  Remove every message you've sent in communities
                </p>
              </div>
            </div>
            <button
              onClick={() => setModal("community")}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 px-4 py-3.5 dark:border-red-900/50">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <TriangleAlert className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Delete account
                </p>
                <p className="text-xs text-gray-400">
                  Permanently remove your account and all data
                </p>
              </div>
            </div>
            <button
              onClick={() => setModal("account")}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <DeleteAccountModal
        open={modal === "account"}
        onConfirm={deleteAccount}
        onCancel={closeModal}
        loading={deletingAccount}
      />
    </div>
  )
}
