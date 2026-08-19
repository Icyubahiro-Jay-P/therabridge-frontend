import { X, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import type { Activity } from "@/lib/activity-api"

const MOOD_OPTIONS = [
  { value: "great", label: "Great", emoji: "😊" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "bad", label: "Bad", emoji: "😔" },
  { value: "terrible", label: "Terrible", emoji: "😢" },
]

interface CompleteActivityModalProps {
  activity: Activity | null
  onClose: () => void
  onComplete: (data: { actualPleasure?: number; moodAfter?: string; notes?: string }) => Promise<void>
  saving: boolean
}

export function CompleteActivityModal({ activity, onClose, onComplete, saving }: CompleteActivityModalProps) {
  const [actualPleasure, setActualPleasure] = useState(5)
  const [moodAfter, setMoodAfter] = useState("")
  const [notes, setNotes] = useState("")

  if (!activity) return null

  const handleSubmit = async () => {
    await onComplete({
      actualPleasure,
      moodAfter: moodAfter || undefined,
      notes: notes || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Complete Activity</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
          {activity.expectedPleasure && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Expected pleasure: {activity.expectedPleasure}/10
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Actual pleasure: {actualPleasure}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={actualPleasure}
              onChange={(e) => setActualPleasure(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">How did you feel after?</label>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMoodAfter(m.value)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
                    moodAfter === m.value
                      ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-[10px] text-gray-600 dark:text-gray-400">{m.label}</span>
                </button>
              ))}
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
              placeholder="How did it go?"
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
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle2 className="size-4" />
            {saving ? "Saving..." : "Complete"}
          </button>
        </div>
      </div>
    </div>
  )
}
