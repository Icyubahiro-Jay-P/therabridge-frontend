import { X, Lightbulb } from "lucide-react"
import { useEffect, useState } from "react"
import { LIMITS } from "@/lib/limits"
import { CharCounter } from "@/components/ui/char-counter"
import type { ThoughtRecord } from "@/lib/thoughtRecord-api"

const DISTORTIONS = [
  { value: "all_or_nothing", label: "All-or-Nothing Thinking", desc: "Seeing things in black and white categories" },
  { value: "overgeneralization", label: "Overgeneralization", desc: "Seeing a single negative event as a never-ending pattern" },
  { value: "mental_filter", label: "Mental Filter", desc: "Focusing only on negatives while ignoring positives" },
  { value: "disqualifying_positive", label: "Disqualifying the Positive", desc: "Rejecting positive experiences by insisting they don't count" },
  { value: "mind_reading", label: "Mind Reading", desc: "Assuming you know what others are thinking" },
  { value: "fortune_telling", label: "Fortune Telling", desc: "Predicting things will turn out badly" },
  { value: "magnification", label: "Magnification", desc: "Exaggerating the importance of problems" },
  { value: "minimization", label: "Minimization", desc: "Shrinking the importance of your qualities" },
  { value: "emotional_reasoning", label: "Emotional Reasoning", desc: "Assuming feelings reflect facts" },
  { value: "should_statements", label: "Should Statements", desc: "Criticizing yourself with shoulds and musts" },
  { value: "labeling", label: "Labeling", desc: "Attaching a fixed label to yourself or others" },
  { value: "personalization", label: "Personalization", desc: "Blaming yourself for things outside your control" },
  { value: "none", label: "No Distortion", desc: "Thought seems balanced and realistic" },
]

interface ThoughtRecordEditorProps {
  open: boolean
  record: ThoughtRecord | null
  saving: boolean
  error: string | null
  onSave: (data: {
    situation: string
    automaticThought: string
    emotions: string
    emotionIntensity: number
    distortionType: string
    evidenceFor: string
    evidenceAgainst: string
    reframe: string
  }) => Promise<void>
  onClose: () => void
}

export function ThoughtRecordEditor({ open, record, saving, error, onSave, onClose }: ThoughtRecordEditorProps) {
  const [step, setStep] = useState(0)
  const [situation, setSituation] = useState("")
  const [automaticThought, setAutomaticThought] = useState("")
  const [emotions, setEmotions] = useState("")
  const [emotionIntensity, setEmotionIntensity] = useState(5)
  const [distortionType, setDistortionType] = useState("none")
  const [evidenceFor, setEvidenceFor] = useState("")
  const [evidenceAgainst, setEvidenceAgainst] = useState("")
  const [reframe, setReframe] = useState("")

  useEffect(() => {
    if (record) {
      setSituation(record.situation)
      setAutomaticThought(record.automaticThought)
      setEmotions(record.emotions)
      setEmotionIntensity(record.emotionIntensity)
      setDistortionType(record.distortionType)
      setEvidenceFor(record.evidenceFor || "")
      setEvidenceAgainst(record.evidenceAgainst || "")
      setReframe(record.reframe)
    } else {
      setSituation("")
      setAutomaticThought("")
      setEmotions("")
      setEmotionIntensity(5)
      setDistortionType("none")
      setEvidenceFor("")
      setEvidenceAgainst("")
      setReframe("")
    }
    setStep(0)
  }, [record, open])

  if (!open) return null

  const canNext =
    (step === 0 && situation.trim().length > 0) ||
    (step === 1 && automaticThought.trim().length > 0) ||
    (step === 2 && emotions.trim().length > 0) ||
    (step === 3) ||
    (step === 4 && evidenceFor.trim().length > 0) ||
    (step === 5 && reframe.trim().length > 0)

  const handleSubmit = async () => {
    await onSave({
      situation, automaticThought, emotions, emotionIntensity,
      distortionType, evidenceFor, evidenceAgainst, reframe,
    })
  }

  const steps = [
    { title: "Situation", subtitle: "What happened?" },
    { title: "Automatic Thought", subtitle: "What went through your mind?" },
    { title: "Emotions", subtitle: "What did you feel?" },
    { title: "Distortion", subtitle: "Any cognitive distortion?" },
    { title: "Evidence", subtitle: "Challenge the thought" },
    { title: "Reframe", subtitle: "A balanced perspective" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {record ? "Edit Thought Record" : "New Thought Record"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step {step + 1} of {steps.length}: {steps[step].subtitle}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="size-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6 flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="min-h-50">
          {step === 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Describe the situation that triggered the negative thought
              </label>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                maxLength={LIMITS.thoughtRecord.situation}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., My friend didn't reply to my message for 3 hours..."
              />
               <CharCounter count={situation.length} limit={LIMITS.thoughtRecord.situation} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                What automatic thought went through your mind?
              </label>
              <textarea
                value={automaticThought}
                onChange={(e) => setAutomaticThought(e.target.value)}
                maxLength={LIMITS.thoughtRecord.automaticThought}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., They must be angry at me..."
              />
               <CharCounter count={automaticThought.length} limit={LIMITS.thoughtRecord.automaticThought} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  What emotions did you feel?
                </label>
                <input
                  value={emotions}
                  onChange={(e) => setEmotions(e.target.value)}
                  maxLength={LIMITS.thoughtRecord.emotions}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., Anxiety, rejection, sadness"
                />
                <CharCounter count={emotions.length} limit={LIMITS.thoughtRecord.emotions} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Intensity: {emotionIntensity}/10
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={emotionIntensity}
                  onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Mild</span>
                  <span>Intense</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Does this thought contain a cognitive distortion?
              </label>
              <div className="max-h-75 space-y-2 overflow-y-auto pr-1">
                {DISTORTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDistortionType(d.value)}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      distortionType === d.value
                        ? "border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-950/40"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{d.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Evidence supporting the thought
                </label>
                <textarea
                  value={evidenceFor}
                  onChange={(e) => setEvidenceFor(e.target.value)}
                  maxLength={LIMITS.thoughtRecord.evidenceFor}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="What facts support this thought?"
                />
                <CharCounter count={evidenceFor.length} limit={LIMITS.thoughtRecord.evidenceFor} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Evidence against the thought
                </label>
                <textarea
                  value={evidenceAgainst}
                  onChange={(e) => setEvidenceAgainst(e.target.value)}
                  maxLength={LIMITS.thoughtRecord.evidenceAgainst}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="What facts contradict this thought?"
                />
                <CharCounter count={evidenceAgainst.length} limit={LIMITS.thoughtRecord.evidenceAgainst} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-950/30">
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 size-4 text-violet-600 dark:text-violet-400" />
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    Write a balanced, realistic thought that considers both the evidence for and against your automatic thought.
                  </p>
                </div>
              </div>
              <textarea
                value={reframe}
                onChange={(e) => setReframe(e.target.value)}
                maxLength={LIMITS.thoughtRecord.reframe}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., My friend may be busy and not replying has nothing to do with me..."
              />
              <CharCounter count={reframe.length} limit={LIMITS.thoughtRecord.reframe} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {step > 0 ? "Back" : "Cancel"}
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving || !reframe.trim()}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Record"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
