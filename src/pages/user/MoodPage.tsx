import { useMoodState } from "./components/mood/useMoodState"
import { MoodSelector } from "./components/mood/MoodSelector"
import { MoodChart } from "./components/mood/MoodChart"
import { MoodHistory } from "./components/mood/MoodHistory"

export function MoodPage() {
  const {
    moods, stats, loading, error, success,
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

      <MoodChart stats={stats} />
      <MoodHistory moods={moods} loading={loading} />
    </div>
  )
}
