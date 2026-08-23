import { Brain, Trash2 } from "lucide-react"

const DISTORTION_LABELS: Record<string, string> = {
  all_or_nothing: "All-or-Nothing",
  overgeneralization: "Overgeneralization",
  mental_filter: "Mental Filter",
  disqualifying_positive: "Disqualifying Positive",
  mind_reading: "Mind Reading",
  fortune_telling: "Fortune Telling",
  magnification: "Magnification",
  minimization: "Minimization",
  emotional_reasoning: "Emotional Reasoning",
  should_statements: "Should Statements",
  labeling: "Labeling",
  personalization: "Personalization",
  none: "No Distortion",
}

const MOOD_COLORS: Record<string, string> = {
  great: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  okay: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  bad: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-500",
  terrible: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
}

interface ThoughtRecordCardProps {
  record: {
    _id: string
    situation: string
    automaticThought: string
    emotions: string
    emotionIntensity: number
    distortionType: string
    reframe: string
    mood: string | null
    createdAt: string
  }
  onSelect: () => void
  onDelete: () => void
  currentUserId?: string
}

export function ThoughtRecordCard({ record, onSelect, onDelete, currentUserId }: ThoughtRecordCardProps) {
  const date = new Date(record.createdAt)
  const distortionLabel = DISTORTION_LABELS[record.distortionType] || record.distortionType

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-teal-300 hover:bg-teal-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-teal-600 dark:hover:bg-teal-950/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-950/50">
            <Brain className="size-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
              {record.situation}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              &ldquo;{record.automaticThought}&rdquo;
            </p>
          </div>
        </div>
        {currentUserId && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="shrink-0 rounded-lg p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-600"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {record.mood && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${MOOD_COLORS[record.mood] ?? ""}`}>
            {record.mood}
          </span>
        )}
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
          {distortionLabel}
        </span>
        <span className="text-xs text-gray-400">
          Distress: {record.emotionIntensity}/10
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {date.toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
