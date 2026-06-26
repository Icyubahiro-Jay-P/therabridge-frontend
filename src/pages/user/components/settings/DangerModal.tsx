import { useState, useEffect } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export function DangerModal({ open, title, description, confirmLabel, confirmInputLabel, requiredInput, loading, onConfirm, onCancel }: DangerModalProps) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
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
