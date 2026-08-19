import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, Square, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  onCancel: () => void
  sending?: boolean
}

export function VoiceRecorder({
  onRecordingComplete,
  onCancel,
  sending = false,
}: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [analyserData, setAnalyserData] = useState<number[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      analyserRef.current = analyser

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm"
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.start(100)
      setRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)

      const drawWave = () => {
        if (!analyserRef.current) return
        const data = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(data)
        const normalized = Array.from(data).map((v) => v / 255)
        setAnalyserData(normalized)
        rafRef.current = requestAnimationFrame(drawWave)
      }
      rafRef.current = requestAnimationFrame(drawWave)
    } catch {
      onCancel()
    }
  }, [onCancel])

  useEffect(() => {
    startRecording()
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearInterval(timerRef.current ?? undefined)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startRecording])

  function stopRecording() {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === "inactive") return
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
      streamRef.current?.getTracks().forEach((t) => t.stop())
      cancelAnimationFrame(rafRef.current)
      clearInterval(timerRef.current ?? undefined)
      onRecordingComplete(blob, duration)
    }
    recorder.stop()
    setRecording(false)
  }

  function cancelRecording() {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== "inactive") {
      recorder.stop()
    }
    streamRef.current?.getTracks().forEach((t) => t.stop())
    cancelAnimationFrame(rafRef.current)
    clearInterval(timerRef.current ?? undefined)
    onCancel()
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={cancelRecording}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400"
      >
        <X className="size-4" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-8 flex-1 items-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          {analyserData.length > 0 ? (
            <canvas
              ref={canvasRef}
              width={200}
              height={32}
              className="h-8 w-full"
              ref={(canvas) => {
                if (!canvas) return
                const ctx = canvas.getContext("2d")
                if (!ctx) return
                const w = canvas.width
                const h = canvas.height
                ctx.clearRect(0, 0, w, h)
                const barWidth = w / analyserData.length
                analyserData.forEach((v, i) => {
                  const barH = Math.max(2, v * h)
                  const x = i * barWidth
                  const y = (h - barH) / 2
                  ctx.fillStyle = "rgb(16, 185, 129)"
                  ctx.beginPath()
                  ctx.roundRect(x + 1, y, barWidth - 2, barH, 2)
                  ctx.fill()
                })
              }}
            />
          ) : (
            <div className="flex items-center gap-1 px-3">
              <span className="size-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>
        {analyserData.length > 0 && (
          <span className="shrink-0 text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
            {formatTime(duration)}
          </span>
        )}
      </div>

      <Button
        onClick={stopRecording}
        disabled={sending || duration < 1}
        className="size-9 shrink-0 rounded-full bg-emerald-600 p-0 hover:bg-emerald-700"
      >
        {sending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </div>
  )
}
