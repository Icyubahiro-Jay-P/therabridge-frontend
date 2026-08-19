import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VoiceMessagePlayer({
  audioUrl,
  duration,
  isMe,
}: {
  audioUrl: string
  duration?: number | null
  isMe: boolean
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadedDuration, setLoadedDuration] = useState(duration || 0)
  const rafRef = useRef<number>(0)

  const updateProgress = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.duration && isFinite(audio.duration)) {
      setLoadedDuration(audio.duration)
      setProgress((audio.currentTime / audio.duration) * 100)
    }
    if (!audio.paused) {
      rafRef.current = requestAnimationFrame(updateProgress)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => {
      setPlaying(false)
      setProgress(0)
      cancelAnimationFrame(rafRef.current)
    }
    const onLoaded = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setLoadedDuration(audio.duration)
      }
    }
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("loadedmetadata", onLoaded)
    return () => {
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("loadedmetadata", onLoaded)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      cancelAnimationFrame(rafRef.current)
    } else {
      audio.currentTime = 0
      audio.play()
      setPlaying(true)
      rafRef.current = requestAnimationFrame(updateProgress)
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />
      <button
        onClick={(e) => {
          e.stopPropagation()
          togglePlay()
        }}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
          isMe
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
        )}
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div
          className={cn(
            "h-1.5 w-full overflow-hidden rounded-full",
            isMe ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-100",
              isMe ? "bg-white" : "bg-emerald-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span
          className={cn(
            "text-[10px]",
            isMe ? "text-white/70" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {playing
            ? formatDuration((progress / 100) * loadedDuration)
            : formatDuration(loadedDuration)}
        </span>
      </div>
    </div>
  )
}
