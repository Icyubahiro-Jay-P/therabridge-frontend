import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Modal } from "@/components/ui/modal"
import {
  HABIT_COLORS,
  colorClasses,
  type HabitColor,
  type HabitWithProgress,
  type HabitPayload,
} from "@/lib/habits-api"

const EMOJI_CHOICES = ["✅", "💧", "🚶", "🏃", "🧘", "😴", "📖", "🥗", "💊", "☀️", "🧠", "🙏"]

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]
const DAY_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface HabitDialogProps {
  open: boolean
  editing: HabitWithProgress | null
  saving: boolean
  error: string | null
  onSave: (payload: HabitPayload) => void
  onClose: () => void
}

export function HabitDialog({ open, editing, saving, error, onSave, onClose }: HabitDialogProps) {
  const [name, setName] = useState(editing?.name ?? "")
  const [emoji, setEmoji] = useState(editing?.emoji ?? "✅")
  const [color, setColor] = useState<HabitColor>(editing?.color ?? "emerald")
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    editing?.daysOfWeek ?? [0, 1, 2, 3, 4, 5, 6],
  )
  const [useReminder, setUseReminder] = useState(!!editing?.reminderTime)
  const [reminderTime, setReminderTime] = useState(editing?.reminderTime ?? "08:00")

  if (!open) return null

  const toggleDay = (day: number) =>
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    )

  const submit = () =>
    onSave({
      name: name.trim(),
      emoji,
      color,
      daysOfWeek,
      reminderTime: useReminder ? reminderTime : null,
    })

  return (
    <Modal open={open} onClose={onClose}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editing ? "Edit Habit" : "New Habit"}
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
            placeholder="Habit name (e.g. Drink water)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoFocus
          />

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Icon</p>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_CHOICES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`flex size-9 items-center justify-center rounded-xl text-lg transition-colors ${
                    emoji === e
                      ? `ring-2 ${colorClasses[color].ring} bg-gray-100 dark:bg-gray-800`
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Color</p>
            <div className="flex gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => setColor(c)}
                  className={`size-7 rounded-full transition-transform ${colorClasses[c].bg} ${
                    color === c ? "scale-110 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Days</p>
            <div className="flex gap-1.5">
              {DAY_LABELS.map((label, day) => (
                <button
                  key={day}
                  type="button"
                  title={DAY_FULL[day]}
                  onClick={() => toggleDay(day)}
                  className={`size-9 rounded-xl text-sm font-medium transition-colors ${
                    daysOfWeek.includes(day)
                      ? `${colorClasses[color].soft} ${colorClasses[color].text} border border-current`
                      : "border border-gray-200 text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={useReminder} onCheckedChange={(v) => setUseReminder(v)} id="habit-reminder" />
            <label htmlFor="habit-reminder" className="text-sm text-gray-600 dark:text-gray-400">
              Daily reminder
            </label>
            {useReminder && (
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving || !name.trim()}>
            {saving ? "Saving..." : editing ? "Update" : "Create"}
          </Button>
        </div>
    </Modal>
  )
}
