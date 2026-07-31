import ding from "@/assets/ding.mp3"

let audioEl: HTMLAudioElement | null = null

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) {
      const s = JSON.parse(stored)
      return s[key] ?? fallback
    }
  } catch {}
  return fallback
}

function getAudio(): HTMLAudioElement {
  if (!audioEl) audioEl = new Audio(ding)
  return audioEl
}

export function playMessageSound() {
  if (!loadSetting("soundEnabled", true)) return
  const volume = Math.max(0, Math.min(100, loadSetting("soundVolume", 70)))
  const calm = loadSetting("calmMode", false)
  const audio = getAudio()
  audio.volume = calm ? 0.15 : volume / 100
  audio.currentTime = 0
  void audio.play().catch(() => {})
}

export function playTestSound() {
  if (typeof window === "undefined") return
  const audio = getAudio()
  audio.volume = 0.8
  audio.currentTime = 0
  void audio.play().catch(() => {})
}
