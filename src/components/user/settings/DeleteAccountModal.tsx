import { DangerModal } from "./DangerModal"

export function DeleteAccountModal({ open, onConfirm, onCancel, loading }: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  const username = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("auth-storage") ?? "{}")
      return (u.state?.user?.username ?? "")
    } catch { return "" }
  })()

  return (
    <DangerModal
      open={open}
      title="Delete account?"
      description="This action cannot be undone. Your account, messages, and all associated data will be permanently lost."
      confirmLabel="Delete Account"
      confirmInputLabel="Type your username to confirm"
      requiredInput={username}
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
