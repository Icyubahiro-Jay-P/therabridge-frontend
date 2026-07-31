import { TriangleAlert } from "lucide-react"
import { useMoodState } from "@/components/user/mood/useMoodState"
import { MoodSelector } from "@/components/user/mood/MoodSelector"
import { MoodChart } from "@/components/user/mood/MoodChart"
import { MoodHistory } from "@/components/user/mood/MoodHistory"

export function MoodPage() {
  const {
    moods, stats, loading, loadError, error, success,
    selectedMood, note, intensity, factors, saving,
    setSelectedMood, setNote, setIntensity, toggleFactor, handleLog,
    setError, setSuccess,
  } = useMoodState()

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mood Tracker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track how you're feeling and discover patterns.</p>
      </div>

      {loadError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <TriangleAlert className="size-4 shrink-0" />
          {loadError}
        </div>
      )}

      <MoodSelector
        selectedMood={selectedMood}
        note={note}
        intensity={intensity}
        factors={factors}
        saving={saving}
        error={error}
        success={success}
        onSelectMood={setSelectedMood}
        onNoteChange={setNote}
        onIntensityChange={setIntensity}
        onToggleFactor={toggleFactor}
        onLog={handleLog}
        onDismissError={() => setError(null)}
        onDismissSuccess={() => setSuccess(null)}
      />

      {!loadError && <MoodChart stats={stats} />}
      <MoodHistory moods={moods} loading={loading} error={loadError && !moods.length ? loadError : null} />
    </div>
  )
}
