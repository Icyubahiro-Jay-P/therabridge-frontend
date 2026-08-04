import { useEffect, useRef } from "react"

interface WatermarkCanvasProps {
  enabled: boolean
  /** Who the watermark identifies (e.g. the viewer's userId). */
  seed: string
  label?: string
  className?: string
}

/**
 * Tiles a low-opacity diagonal "<label> · <seed> · timestamp" watermark across
 * the parent element on a canvas. Deters casual copying only — it cannot stop
 * screenshots.
 */
export function WatermarkCanvas({ enabled, seed, label, className }: WatermarkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !parent || !ctx) return

    let observer: ResizeObserver | null = null
    const draw = () => {
      const rect = parent.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      if (width === 0 || height === 0) return
      const dpr = window.devicePixelRatio || 1
      if (canvas.width !== width * dpr) canvas.width = width * dpr
      if (canvas.height !== height * dpr) canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const stamp = new Date().toISOString()
      const text = `${label ? `${label} · ` : ""}${seed} · ${stamp}`
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate((-30 * Math.PI) / 180)
      ctx.fillStyle = "rgba(100, 100, 110, 0.10)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      const spacingX = 220
      const spacingY = 140
      const range = width + 400
      for (let x = -range; x < range; x += spacingX) {
        for (let y = -range; y < height + 400; y += spacingY) {
          ctx.fillText(text, x, y)
        }
      }
      ctx.restore()
    }

    draw()
    const observer = new ResizeObserver(() => {
      frame++
      draw()
    })
    observer.observe(parent)
    const interval = window.setInterval(draw, 30000)
    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [enabled, seed, label])

  if (!enabled) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 ${className ?? ""}`}
    />
  )
}
