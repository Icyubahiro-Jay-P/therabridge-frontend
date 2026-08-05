import { KeyRound, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { LIMITS } from "@/lib/limits"
import type { CommunityCategory } from "./types"

const CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "stress", label: "Stress" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "support", label: "Support" },
  { value: "therapy", label: "Therapy" },
  { value: "wellness", label: "Wellness" },
]

export function SettingsForm({
  name,
  description,
  category,
  isPrivate,
  rules,
  inviteKey,
  isOwner,
  saving,
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
  onIsPrivateChange,
  onRulesChange,
  onSave,
}: {
  name: string
  description: string
  category: CommunityCategory
  isPrivate: boolean
  rules: string
  inviteKey: string
  isOwner: boolean
  saving: boolean
  onNameChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onCategoryChange: (v: CommunityCategory) => void
  onIsPrivateChange: (v: boolean) => void
  onRulesChange: (v: string) => void
  onSave: () => void
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Name
      </label>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value.slice(0, LIMITS.community.name))}
        disabled={!isOwner}
        maxLength={LIMITS.community.name}
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Description
      </label>
      <Input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value.slice(0, LIMITS.community.description))}
        disabled={!isOwner}
        maxLength={LIMITS.community.description}
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Category
      </label>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as CommunityCategory)}
        disabled={!isOwner}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Rules
      </label>
      <Input
        value={rules}
        onChange={(e) => onRulesChange(e.target.value.slice(0, LIMITS.community.rules))}
        disabled={!isOwner}
        placeholder="Guidelines for members..."
        maxLength={LIMITS.community.rules}
      />
      <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          {isPrivate ? (
            <Lock className="size-4" />
          ) : (
            <Globe className="size-4" />
          )}
          Private (approval required)
        </div>
        <Switch
          checked={isPrivate}
          onCheckedChange={onIsPrivateChange}
          disabled={!isOwner}
        />
      </div>
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
