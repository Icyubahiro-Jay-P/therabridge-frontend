import { useState, useRef, useEffect } from "react"
import { X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  onCancel: () => void
  sending?: boolean
}

const BAR_WIDTH = 3
const BAR_GAP = 2
const BAR_PITCH = BAR_WIDTH + BAR_GAP
const MIN_LEVEL = 0.08
const GAIN = 4

export function VoiceRecorder({
  onRecordingComplete,
  onCancel,
  sending = false,
}: VoiceRecorderProps) {
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)
  const durationRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveHolderRef = useRef<HTMLDivElement | null>(null)
  const historyRef = useRef<number[]>([])
  const smoothedRef = useRef(0)
  const onCancelRef = useRef(onCancel)

  useEffect(() => {
    onCancelRef.current = onCancel
  })

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream

        const audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 512
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
        durationRef.current = 0
        setDuration(0)

        timerRef.current = setInterval(() => {
          durationRef.current += 1
          setDuration(durationRef.current)
        }, 1000)

        // Time-domain amplitude sampled into a scrolling bar history (the
        // WhatsApp/Telegram pattern) instead of a raw 32-bin frequency
        // spectrum. The canvas backing store is sized to the holder's real
        // pixel size (times devicePixelRatio) every frame, which is what
        // actually fixes the stretched/blurry look: the old canvas had a
        // fixed 200x32 buffer stretched by CSS to whatever width the input
        // row happened to render at.
        const timeData = new Uint8Array(analyser.fftSize)
        const tick = () => {
          const canvas = canvasRef.current
          const holder = waveHolderRef.current
          const activeAnalyser = analyserRef.current
          if (canvas && holder && activeAnalyser) {
            activeAnalyser.getByteTimeDomainData(timeData)
            let sumSquares = 0
            for (let i = 0; i < timeData.length; i++) {
              const centered = (timeData[i] - 128) / 128
              sumSquares += centered * centered
            }
            const rms = Math.sqrt(sumSquares / timeData.length)
            const level = Math.min(1, rms * GAIN)
            // Fast attack, slow release — a real meter ballistic, so bars
            // rise instantly on a syllable and settle gently after, instead
            // of snapping around every animation frame.
            const attack = level > smoothedRef.current ? 0.6 : 0.15
            smoothedRef.current += (level - smoothedRef.current) * attack
            const barLevel = Math.max(MIN_LEVEL, smoothedRef.current)

            const cssWidth = holder.clientWidth
            const cssHeight = holder.clientHeight
            const dpr = window.devicePixelRatio || 1
            const targetW = Math.max(1, Math.round(cssWidth * dpr))
            const targetH = Math.max(1, Math.round(cssHeight * dpr))
            if (canvas.width !== targetW || canvas.height !== targetH) {
              canvas.width = targetW
              canvas.height = targetH
            }

            const maxBars = Math.max(1, Math.floor(cssWidth / BAR_PITCH))
            const history = historyRef.current
            history.push(barLevel)
            while (history.length > maxBars) history.shift()

            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
              ctx.clearRect(0, 0, cssWidth, cssHeight)
              ctx.fillStyle = "rgb(16, 185, 129)"
              const startX = cssWidth - history.length * BAR_PITCH
              history.forEach((v, i) => {
                const barH = Math.max(2, v * cssHeight)
                const x = startX + i * BAR_PITCH
                const y = (cssHeight - barH) / 2
                ctx.beginPath()
                ctx.roundRect(x, y, BAR_WIDTH, barH, BAR_WIDTH / 2)
                ctx.fill()
              })
            }
          }
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      } catch {
        onCancelRef.current()
      }
    }
    void init()
    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      clearInterval(timerRef.current ?? undefined)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function stopRecording() {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === "inactive") return
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
      streamRef.current?.getTracks().forEach((t) => t.stop())
      cancelAnimationFrame(rafRef.current)
      clearInterval(timerRef.current ?? undefined)
      onRecordingComplete(blob, durationRef.current)
    }
    recorder.stop()
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

      <div className="flex h-8 min-w-0 flex-1 items-center gap-2.5 rounded-full bg-gray-100 pr-3 pl-2 dark:bg-gray-800">
        <span className="size-2 shrink-0 animate-pulse rounded-full bg-red-500" />
        <div ref={waveHolderRef} className="h-full min-w-0 flex-1">
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
          {formatTime(duration)}
        </span>
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
