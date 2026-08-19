import { useState } from "react"
import { X, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const MOODS = ["great", "good", "okay", "bad", "terrible"] as const

const MOOD_LABELS: Record<string, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  bad: "Bad",
  terrible: "Terrible",
}

const MOOD_EMOJI: Record<string, string> = {
  great: "\u{1F604}",
  good: "\u{1F642}",
  okay: "\u{1F610}",
  bad: "\u{1F61E}",
  terrible: "\u{1F622}",
}

interface JournalEditorProps {
  open: boolean
  title: string
  content: string
  mood: string | null
  tags: string[]
  isPublic: boolean
  saving: boolean
  error: string | null
  isEditing: boolean
  onTitleChange: (v: string) => void
  onContentChange: (v: string) => void
  onMoodChange: (v: string | null) => void
  onTagsChange: (v: string[]) => void
  onIsPublicChange: (v: boolean) => void
  onSave: () => void
  onClose: () => void
}

export function JournalEditor({
  open,
  title,
  content,
  mood,
  tags,
  isPublic,
  saving,
  error,
  isEditing,
  onTitleChange,
  onContentChange,
  onMoodChange,
  onTagsChange,
  onIsPublicChange,
  onSave,
  onClose,
}: JournalEditorProps) {
  const [tagInput, setTagInput] = useState("")

  if (!open) return null

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 10) {
      onTagsChange([...tags, t])
      setTagInput("")
    }
  }

  const removeTag = (t: string) => {
    onTagsChange(tags.filter((tag) => tag !== t))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Edit Entry" : "New Entry"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="size-5 text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={200}
          />

          <Textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={6}
            maxLength={5000}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Mood</p>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => onMoodChange(mood === m ? null : m)}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    mood === m
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{MOOD_EMOJI[m]}</span>
                  <span>{MOOD_LABELS[m]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  <Tag className="size-3" />
                  {t}
                  <button onClick={() => removeTag(t)} className="ml-0.5 hover:text-red-500">
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              {tags.length < 10 && (
                <div className="flex items-center gap-1">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="w-20 rounded-full border-0 bg-transparent text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none dark:text-gray-400"
                  />
                  <button onClick={addTag} className="text-gray-400 hover:text-blue-500">
                    <Plus className="size-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={isPublic} onCheckedChange={onIsPublicChange} id="public" />
            <label htmlFor="public" className="text-sm text-gray-600 dark:text-gray-400">
              Make public
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
