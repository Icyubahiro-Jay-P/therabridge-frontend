import { X } from "lucide-react"
import { useState } from "react"
import { CATEGORIES } from "@/lib/activity-api"
import { LIMITS } from "@/lib/limits"
import { Modal } from "@/components/ui/modal"

interface ActivityEditorProps {
  open: boolean
  onClose: () => void
  onSave: (data: {
    title: string; category: string; scheduledDate: string;
    scheduledTime?: string; duration?: number; expectedPleasure: number;
    moodBefore?: string; notes?: string;
  }) => Promise<void>
  saving: boolean
}

export function ActivityEditor({ open, onClose, onSave, saving }: ActivityEditorProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("social")
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0])
  const [scheduledTime, setScheduledTime] = useState("")
  const [duration, setDuration] = useState("")
  const [expectedPleasure, setExpectedPleasure] = useState(5)
  const [moodBefore, setMoodBefore] = useState("")
  const [notes, setNotes] = useState("")

  if (!open) return null

  const handleSubmit = async () => {
    await onSave({
      title,
      category,
      scheduledDate,
      scheduledTime: scheduledTime || undefined,
      duration: duration ? Number(duration) : undefined,
      expectedPleasure,
      moodBefore: moodBefore || undefined,
      notes: notes || undefined,
    })
    setTitle("")
    setCategory("social")
    setScheduledDate(new Date().toISOString().split("T")[0])
    setScheduledTime("")
    setDuration("")
    setExpectedPleasure(5)
    setMoodBefore("")
    setNotes("")
  }

  return (
    <Modal open={open} onClose={onClose}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Plan an Activity</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={LIMITS.thoughtRecord.situation}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g., Go for a walk, Call a friend..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    category === c.value
                      ? "bg-emerald-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time (optional)</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected pleasure: {expectedPleasure}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={expectedPleasure}
              onChange={(e) => setExpectedPleasure(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Any additional details..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Plan Activity"}
          </button>
        </div>
    </Modal>
  )
}
