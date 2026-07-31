import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { moodOptions, factorOptions, intensityLabels } from "./useMoodState"

interface MoodSelectorProps {
  selectedMood: string; note: string; intensity: number; factors: string[]; saving: boolean
  error: string | null; success: string | null
  onSelectMood: (v: string) => void; onNoteChange: (v: string) => void
  onIntensityChange: (v: number) => void; onToggleFactor: (f: string) => void; onLog: () => void
  onDismissError: () => void; onDismissSuccess: () => void
}

export function MoodSelector({
  selectedMood, note, intensity, factors, saving, error, success,
  onSelectMood, onNoteChange, onIntensityChange, onToggleFactor, onLog,
  onDismissError, onDismissSuccess,
}: MoodSelectorProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">How are you feeling?</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" /> {error}
          <button onClick={onDismissError} className="ml-auto text-red-500 hover:text-red-700">&times;</button>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="size-4 shrink-0" /> {success}
          <button onClick={onDismissSuccess} className="ml-auto text-emerald-500 hover:text-emerald-700">&times;</button>
        </div>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        {moodOptions.map((m) => (
          <button key={m.value} onClick={() => onSelectMood(m.value)} className={cn(
            "flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
            selectedMood === m.value
              ? `${m.color} ring-2 ring-offset-2`
              : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          )}>
            <span className="text-lg">{m.emoji}</span> {m.label}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Intensity: {intensityLabels[Math.min(Math.floor(intensity / 2.5), 4)]}
        </p>
        <input type="range" min="1" max="10" value={intensity}
          onChange={(e) => onIntensityChange(Number(e.target.value))} className="w-full accent-emerald-600" />
        <div className="flex justify-between text-xs text-gray-400"><span>Low</span><span>High</span></div>
      </div>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Factors (optional)</p>
        <div className="flex flex-wrap gap-1.5">
          {factorOptions.map((f) => (
            <button key={f} onClick={() => onToggleFactor(f)} className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              factors.includes(f)
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            )}>{f}</button>
          ))}
        </div>
      </div>
      <Textarea value={note} onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Add a note (optional)..." maxLength={500} rows={2} className="mb-4" />
      <Button onClick={onLog} disabled={!selectedMood || saving} className="bg-emerald-600 hover:bg-emerald-700">
        {saving ? <Loader2 className="size-4 animate-spin" /> : "Log mood"}
      </Button>
    </div>
  )
}
