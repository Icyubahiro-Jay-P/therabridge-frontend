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
  great: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  okay: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  bad: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
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
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-violet-300 hover:bg-violet-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-violet-600 dark:hover:bg-violet-950/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/50">
            <Brain className="size-4 text-violet-600 dark:text-violet-400" />
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
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
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
