import { Moon, TrendingUp } from "lucide-react"
import { StarRating } from "./sleepComponents"

interface SleepLogFormProps {
  quality: number
  setQuality: (v: number) => void
  bedtime: string
  setBedtime: (v: string) => void
  wakeTime: string
  setWakeTime: (v: string) => void
  notes: string
  setNotes: (v: string) => void
  dreams: string
  setDreams: (v: string) => void
  onSubmit: () => void
  saving: boolean
  onCancel: () => void
}

export function SleepLogForm({
  quality,
  setQuality,
  bedtime,
  setBedtime,
  wakeTime,
  setWakeTime,
  notes,
  setNotes,
  dreams,
  setDreams,
  onSubmit,
  saving,
  onCancel,
}: SleepLogFormProps) {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-5 dark:border-teal-900/50 dark:bg-gray-900 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Log Last Night's Sleep
        </h2>
        <button
          onClick={onCancel}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          Cancel
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Sleep Quality
        </label>
        <StarRating value={quality} onChange={setQuality} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Bedtime
          </label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Wake Time
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {bedtime && wakeTime && (
        <div className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-medium text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
          <TrendingUp className="mr-1 inline size-3" />
          Calculated:{" "}
          {(() => {
            const [bh, bm] = bedtime.split(":").map(Number)
            const [wh, wm] = wakeTime.split(":").map(Number)
            const bedMins = bh * 60 + bm
            let wakeMins = wh * 60 + wm
            if (wakeMins < bedMins) wakeMins += 24 * 60
            return ((wakeMins - bedMins) / 60).toFixed(1)
          })()}{" "}
          hours
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          Notes <span className="text-gray-300 dark:text-gray-600">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="How was your sleep?"
        />
        <span className="text-[10px] text-gray-300 dark:text-gray-600">
          {notes.length}/500
        </span>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          Dreams <span className="text-gray-300 dark:text-gray-600">(optional)</span>
        </label>
        <textarea
          value={dreams}
          onChange={(e) => setDreams(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Any dreams you'd like to remember?"
        />
        <span className="text-[10px] text-gray-300 dark:text-gray-600">
          {dreams.length}/500
        </span>
      </div>

      <button
        onClick={onSubmit}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white shadow-md shadow-teal-900/20 transition-colors hover:bg-teal-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      >
        <Moon className="size-4" />
        {saving ? "Saving..." : "Log Sleep"}
      </button>
    </div>
  )
}
