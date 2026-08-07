const suggestions = [
  "I'm feeling anxious about...",
  "I've been feeling sad lately",
  "I'm stressed about work/school",
  "I feel lonely and need someone to talk to",
  "Help me with a breathing exercise",
  "I'm feeling overwhelmed",
]

export function SuggestionChips({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-6 pb-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
