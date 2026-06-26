import { useState, useCallback } from "react"
import { api } from "@/lib/api"

export interface Settings {
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

export function useSettingsState() {
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
    try { await api.delete("/api/chat/messages"); setSuccess("All direct messages deleted."); setModal(null) }
    catch (err) { setServerError(getErrorMessage(err)) }
    finally { setDeletingDMs(false) }
  }, [])
  const deleteCommunityMessages = useCallback(async () => {
    setDeletingCommunity(true); setServerError(null); setSuccess(null)
    try { await api.delete("/api/chat/community-messages"); setSuccess("All community messages deleted."); setModal(null) }
    catch (err) { setServerError(getErrorMessage(err)) }
    finally { setDeletingCommunity(false) }
  }, [])
  const deleteAccount = useCallback(async () => {
    setDeletingAccount(true); setServerError(null); setSuccess(null)
    try {
      const raw = localStorage.getItem("auth-storage") ?? "{}"
      const username = JSON.parse(raw).state?.user?.username ?? ""
      await api.delete("/api/users/profile", { data: { username } })
      setSuccess("Account deleted. Logging out..."); setModal(null)
      setTimeout(() => { window.location.href = "/login" }, 2000)
    } catch (err) { setServerError(getErrorMessage(err)) }
    finally { setDeletingAccount(false) }
  }, [])

  function closeModal() { setModal(null); setServerError(null) }

  return { settings, updateSetting, modal, setModal, closeModal,
    deletingDMs, deletingCommunity, deletingAccount,
    deleteDMs, deleteCommunityMessages, deleteAccount, serverError, success, }
}
