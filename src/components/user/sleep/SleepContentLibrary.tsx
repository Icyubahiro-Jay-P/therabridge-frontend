import { Headphones, Sparkles, BookOpen, Play, Pause } from "lucide-react"
import { TabButton } from "./sleepComponents"
import { formatDuration } from "./sleepUtils"
import { EmptyState } from "@/components/user/shared/EmptyState"
import type { SleepContent } from "@/lib/sleep-api"

function ContentCard({
  item,
  playing,
  onToggle,
}: {
  item: SleepContent
  playing: boolean
  onToggle: () => void
}) {
  const typeIcon =
    item.type === "sound" ? (
      <Headphones className="size-4" />
    ) : item.type === "meditation" ? (
      <Sparkles className="size-4" />
    ) : (
      <BookOpen className="size-4" />
    )

  const categoryColors: Record<string, string> = {
    rain: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
    nature: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    ambient: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    meditation: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    body_scan: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
    breathing: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
  }

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-teal-200 hover:shadow-md hover:shadow-teal-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-teal-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[item.category] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
              {typeIcon}
              {item.type}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {formatDuration(item.duration)}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {item.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 transition-colors hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-400 dark:hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
        </button>
      </div>
    </div>
  )
}

interface SleepContentLibraryProps {
  content: SleepContent[]
  contentLoading: boolean
  activeTab: "sound" | "meditation" | "story"
  setActiveTab: (tab: "sound" | "meditation" | "story") => void
  playingId: string | null
  togglePlay: (id: string) => void
}

export function SleepContentLibrary({
  content,
  contentLoading,
  activeTab,
  setActiveTab,
  playingId,
  togglePlay,
}: SleepContentLibraryProps) {
  const filteredContent = content.filter((c) => c.type === activeTab)

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        Sleep Library
      </h2>
      <div className="flex gap-2 mb-4 flex-wrap">
        <TabButton
          active={activeTab === "sound"}
          onClick={() => setActiveTab("sound")}
          icon={<Headphones className="size-4" />}
          label="Sounds"
        />
        <TabButton
          active={activeTab === "meditation"}
          onClick={() => setActiveTab("meditation")}
          icon={<Sparkles className="size-4" />}
          label="Meditations"
        />
        <TabButton
          active={activeTab === "story"}
          onClick={() => setActiveTab("story")}
          icon={<BookOpen className="size-4" />}
          label="Stories"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredContent.map((item) => (
          <ContentCard
            key={item._id}
            item={item}
            playing={playingId === item._id}
            onToggle={() => togglePlay(item._id)}
          />
        ))}
      </div>
      {!contentLoading && filteredContent.length === 0 && (
        <EmptyState
          icon={Headphones}
          title={
            activeTab === "sound"
              ? "No sounds available yet"
              : activeTab === "meditation"
                ? "No meditations available yet"
                : "No stories available yet"
          }
          description="Calming audio to help you unwind and drift off. The sleep library is curated by our care team, new content is added regularly."
        />
      )}
    </div>
  )
}
