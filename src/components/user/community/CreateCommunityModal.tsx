import { useState } from "react"
import { Loader2, TriangleAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"
import { LIMITS } from "@/lib/limits"
import { getErrorMessage } from "./utils"
import type { Community, CommunityCategory } from "./types"

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

export function CreateCommunityModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (c: Community) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<CommunityCategory>("general")
  const [isPrivate, setIsPrivate] = useState(false)
  const [rules, setRules] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post<Community>("/api/chat/communities", {
        name,
        description,
        category,
        isPrivate,
        rules,
      })
      onCreate(data)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Create a community
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <TriangleAlert className="inline size-4 shrink-0" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="community-name">Community name</Label>
            <Input
              id="community-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, LIMITS.community.name))}
              placeholder="e.g. Calm Corner"
              required
              minLength={2}
              maxLength={LIMITS.community.name}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-desc">Description</Label>
            <Textarea
              id="community-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, LIMITS.community.description))}
              placeholder="What is this space about?"
              maxLength={LIMITS.community.description}
              rows={2}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-category">Category</Label>
            <select
              id="community-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CommunityCategory)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-rules">Rules</Label>
            <Textarea
              id="community-rules"
              value={rules}
              onChange={(e) => setRules(e.target.value.slice(0, LIMITS.community.rules))}
              placeholder="Optional guidelines for members..."
              maxLength={LIMITS.community.rules}
              rows={2}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Private community
              </p>
              <p className="text-xs text-gray-400">
                New members need moderator approval before joining.
              </p>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Create community"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
