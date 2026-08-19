import { ArrowLeft, Edit, Trash2, Brain, Lightbulb, Scale } from "lucide-react"

const DISTORTION_LABELS: Record<string, string> = {
  all_or_nothing: "All-or-Nothing Thinking",
  overgeneralization: "Overgeneralization",
  mental_filter: "Mental Filter",
  disqualifying_positive: "Disqualifying the Positive",
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

interface ThoughtRecordDetailProps {
  record: {
    _id: string
    situation: string
    automaticThought: string
    emotions: string
    emotionIntensity: number
    distortionType: string
    evidenceFor: string
    evidenceAgainst: string
    reframe: string
    mood: string | null
    createdAt: string
  }
  onBack: () => void
  onEdit: (record: ThoughtRecordDetailProps["record"]) => void
  onDelete: (id: string) => void
  currentUserId?: string
}

export function ThoughtRecordDetail({ record, onBack, onEdit, onDelete, currentUserId }: ThoughtRecordDetailProps) {
  const date = new Date(record.createdAt)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          <ArrowLeft className="size-4" />
          Back to records
        </button>
        <div className="flex gap-2">
          {currentUserId && (
            <>
              <button
                onClick={() => onEdit(record)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <Edit className="size-4" />
              </button>
              <button
                onClick={() => onDelete(record._id)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
              >
                <Trash2 className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs text-gray-400">{date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>

        {/* Situation */}
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-gray-800">1</span>
            Situation
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{record.situation}</p>
        </div>

        {/* Automatic Thought */}
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-gray-800">2</span>
            Automatic Thought
          </h3>
          <div className="mt-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm italic text-gray-700 dark:text-gray-300">&ldquo;{record.automaticThought}&rdquo;</p>
          </div>
        </div>

        {/* Emotions */}
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-gray-800">3</span>
            Emotions
          </h3>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">{record.emotions}</span>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
              {record.emotionIntensity}/10
            </span>
          </div>
        </div>

        {/* Distortion */}
        {record.distortionType && record.distortionType !== "none" && (
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-gray-800">4</span>
              Cognitive Distortion
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <Brain className="size-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-400">
                {DISTORTION_LABELS[record.distortionType]}
              </span>
            </div>
          </div>
        )}

        {/* Evidence */}
        {(record.evidenceFor || record.evidenceAgainst) && (
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-gray-800">5</span>
              Evidence
            </h3>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              {record.evidenceFor && (
                <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/20">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">Supporting</p>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-300">{record.evidenceFor}</p>
                </div>
              )}
              {record.evidenceAgainst && (
                <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950/20">
                  <p className="text-xs font-medium text-red-700 dark:text-red-400">Against</p>
                  <p className="mt-1 text-sm text-red-800 dark:text-red-300">{record.evidenceAgainst}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reframe */}
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <span className="flex size-6 items-center justify-center rounded-full bg-violet-100 text-xs dark:bg-violet-950/50">6</span>
            Balanced Reframe
          </h3>
          <div className="mt-2 rounded-xl bg-violet-50 p-4 dark:bg-violet-950/30">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 size-4 text-violet-600 dark:text-violet-400" />
              <p className="text-sm text-violet-800 dark:text-violet-200">{record.reframe}</p>
            </div>
          </div>
        </div>

        {/* Before/After Comparison */}
        {record.emotionIntensity && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Scale className="size-4" />
              Distress Before &rarr; After
            </div>
            <div className="mt-2 flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{record.emotionIntensity}</p>
                <p className="text-xs text-gray-500">Before</p>
              </div>
              <div className="text-gray-400">&rarr;</div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {record.emotionIntensity > 3 ? record.emotionIntensity - 2 : record.emotionIntensity}
                </p>
                <p className="text-xs text-gray-500">After</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
