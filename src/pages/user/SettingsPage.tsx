import { useState, useEffect, useCallback } from "react"
import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  Loader2,
  Lock,
  MessageCircle,
  Moon,
  Sun,
  Trash2,
  TriangleAlert,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"
import type { PrivacyField } from "@/types/user"

interface Settings {
  messagePreviews: boolean
  fontSize: "normal" | "large"
  calmMode: boolean
  soundEnabled: boolean
  focusMode: boolean
  communityScreenshotProtection: boolean
  accountVisibility: "visible" | "anonymous"
  enterToSend: boolean
}

const DEFAULT_SETTINGS: Settings = {
  messagePreviews: true,
  fontSize: "normal",
  calmMode: false,
  soundEnabled: true,
  focusMode: false,
  communityScreenshotProtection: false,
  accountVisibility: "visible",
  enterToSend: true,
}

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {}
  return DEFAULT_SETTINGS
}

function saveSettings(s: Settings) {
  localStorage.setItem("therabridge-settings", JSON.stringify(s))
  if (s.calmMode) document.documentElement.classList.add("calm-mode")
  else document.documentElement.classList.remove("calm-mode")
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return "Something went wrong"
}

interface DangerModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  confirmInputLabel: string
  requiredInput: string
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

function DangerModal({ open, title, description, confirmLabel, confirmInputLabel, requiredInput, loading, onConfirm, onCancel }: DangerModalProps) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  // reset when opened
  useEffect(() => { if (open) { setValue(""); setError("") } }, [open])

  if (!open) return null

  function handleConfirm() {
    if (value !== requiredInput) {
      setError(`Type "${requiredInput}" to confirm`)
      return
    }
    setError("")
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <Trash2 className="size-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>

        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">{confirmInputLabel}</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={requiredInput}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-red-400"
        />
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}

        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading} className="flex-1">Cancel</Button>
          <Button onClick={handleConfirm} disabled={loading || !value} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            {loading ? <Loader2 className="size-4 animate-spin" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [deletingDMs, setDeletingDMs] = useState(false)
  const [deletingCommunity, setDeletingCommunity] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [modal, setModal] = useState<"dm" | "community" | "account" | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...settings, [key]: value }
    setSettings(next)
    saveSettings(next)
    if (key === "communityScreenshotProtection") {
      window.dispatchEvent(new CustomEvent("screenshot-protection-change", { detail: value }))
    }
    window.dispatchEvent(new Event("storage"))
  }

  const deleteDMs = useCallback(async () => {
    setDeletingDMs(true); setServerError(null); setSuccess(null)
    try {
      await api.delete("/api/chat/messages")
      setSuccess("All direct messages deleted.")
      setModal(null)
    } catch (err) { setServerError(getErrorMessage(err)) }
    finally { setDeletingDMs(false) }
  }, [])

  const deleteCommunityMessages = useCallback(async () => {
    setDeletingCommunity(true); setServerError(null); setSuccess(null)
    try {
      await api.delete("/api/chat/community-messages")
      setSuccess("All community messages deleted.")
      setModal(null)
    } catch (err) { setServerError(getErrorMessage(err)) }
    finally { setDeletingCommunity(false) }
  }, [])

  const deleteAccount = useCallback(async () => {
    setDeletingAccount(true); setServerError(null); setSuccess(null)
    try {
      await api.delete("/api/users/profile", { data: { username: (() => { try { const u = JSON.parse(localStorage.getItem("auth-storage") ?? "{}"); return u.state?.user?.username ?? "" } catch { return "" } })() } })
      setSuccess("Account deleted. Logging out...")
      setModal(null)
      setTimeout(() => { window.location.href = "/login" }, 2000)
    } catch (err) { setServerError(getErrorMessage(err)) }
    finally { setDeletingAccount(false) }
  }, [])

  function closeModal() { setModal(null); setServerError(null) }

  function SettingRow({ icon: Icon, label, description, children }: { icon: React.ElementType; label: string; description?: string; children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <Icon className="size-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
            {description && <p className="text-xs text-gray-400">{description}</p>}
          </div>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

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

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Privacy & Visibility</h2>
        <SettingRow icon={Eye} label="Message previews" description="Show message content in conversation list">
          <Switch checked={settings.messagePreviews} onCheckedChange={(v) => updateSetting("messagePreviews", v)} />
        </SettingRow>
        <SettingRow icon={EyeOff} label="Screenshot protection" description="Blur screen when switching away from communities">
          <Switch checked={settings.communityScreenshotProtection} onCheckedChange={(v) => updateSetting("communityScreenshotProtection", v)} />
        </SettingRow>
        <SettingRow icon={User} label="Account visibility" description="Let other users see your profile">
          <select
            value={settings.accountVisibility}
            onChange={(e) => updateSetting("accountVisibility", e.target.value as "visible" | "anonymous")}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="visible">Visible</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </SettingRow>
        <PrivacyToggles />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Appearance</h2>
        <SettingRow icon={Sun} label="Font size">
          <select
            value={settings.fontSize}
            onChange={(e) => updateSetting("fontSize", e.target.value as "normal" | "large")}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
          </select>
        </SettingRow>
        <SettingRow icon={Moon} label="Calm mode" description="Green-tinted low-contrast theme for relaxation">
          <Switch checked={settings.calmMode} onCheckedChange={(v) => updateSetting("calmMode", v)} />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Notifications</h2>
        <SettingRow icon={Bell} label="Sound effects" description="Play sounds for incoming messages">
          <Switch checked={settings.soundEnabled} onCheckedChange={(v) => updateSetting("soundEnabled", v)} />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Focus</h2>
        <SettingRow icon={Fingerprint} label="Focus mode" description="Hide distracting UI elements">
          <Switch checked={settings.focusMode} onCheckedChange={(v) => updateSetting("focusMode", v)} />
        </SettingRow>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Messaging</h2>
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
            <Button variant="outline" size="sm" onClick={() => setModal("dm")} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
              Delete
            </Button>
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
            <Button variant="outline" size="sm" onClick={() => setModal("community")} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
              Delete
            </Button>
          </div>

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
            <Button variant="outline" size="sm" onClick={() => setModal("account")} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
              Delete
            </Button>
          </div>
        </div>
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
      <DangerModal
        open={modal === "account"}
        title="Delete account?"
        description="This action cannot be undone. Your account, messages, and all associated data will be permanently lost."
        confirmLabel="Delete Account"
        confirmInputLabel="Type your username to confirm"
        requiredInput={(() => { try { const u = JSON.parse(localStorage.getItem("auth-storage") ?? "{}"); return (u.state?.user?.username ?? "") } catch { return "" } })()}
        loading={deletingAccount}
        onConfirm={deleteAccount}
        onCancel={closeModal}
      />
    </div>
  )
}

function ReadReceiptsToggle() {
  const user = useAuthStore((state) => state.user)
  const updateChatSettings = useAuthStore((state) => state.updateChatSettings)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [error, setError] = useState("")

  const enabled = user?.chatSettings?.readReceipts ?? true

  async function toggle() {
    setError("")
    try {
      await updateChatSettings({ readReceipts: !enabled })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Switch checked={enabled} onCheckedChange={toggle} disabled={isLoading} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

const privacyLabels: Record<PrivacyField, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  dateOfBirth: "Date of birth",
  bio: "Bio",
}

function PrivacyToggles() {
  const user = useAuthStore((state) => state.user)
  const updatePrivacy = useAuthStore((state) => state.updatePrivacy)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const privacy = user?.privacySettings ?? {
    firstName: "public",
    lastName: "public",
    email: "public",
    dateOfBirth: "public",
    bio: "public",
  }

  const privateCount = Object.values(privacy).filter((v) => v === "private").length

  async function toggle(field: PrivacyField) {
    setMessage("")
    setError("")
    const newValue = privacy[field] === "public" ? "private" : "public"

    if (newValue === "private" && privateCount >= 3) {
      setError("You can hide at most 3 profile fields.")
      return
    }

    try {
      await updatePrivacy({ [field]: newValue })
      setMessage(`${privacyLabels[field]} updated`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700/60 dark:bg-gray-900/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Profile field visibility</p>
        <span className="text-xs text-gray-400">
          {privateCount}/3 hidden
        </span>
      </div>
      <p className="text-xs text-gray-400">
        Toggle which fields are visible on your public profile.
      </p>

      {message && (
        <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-3.5 shrink-0" />
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="space-y-1">
        {(Object.keys(privacyLabels) as PrivacyField[]).map((field) => (
          <button
            key={field}
            onClick={() => toggle(field)}
            disabled={isLoading}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {privacyLabels[field]}
            </span>
            <span
              className={`flex items-center gap-1.5 text-xs font-medium ${
                privacy[field] === "public"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {privacy[field] === "public" ? (
                <><Globe className="size-3.5" /> Public</>
              ) : (
                <><Lock className="size-3.5" /> Private</>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
