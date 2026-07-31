import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/store/auth-store"

export function ReadReceiptsToggle() {
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
