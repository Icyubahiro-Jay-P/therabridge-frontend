import { KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SettingsForm({
  name,
  description,
  inviteKey,
  isOwner,
  saving,
  onNameChange,
  onDescriptionChange,
  onSave,
}: {
  name: string
  description: string
  inviteKey: string
  isOwner: boolean
  saving: boolean
  onNameChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onSave: () => void
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Name
      </label>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        disabled={!isOwner}
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Description
      </label>
      <Input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={!isOwner}
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Invite key
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm tracking-widest text-emerald-600 dark:border-gray-700 dark:bg-gray-800 dark:text-emerald-400">
        <KeyRound className="size-4 shrink-0" /> {inviteKey}
      </div>
      {isOwner && (
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      )}
    </div>
  )
}
