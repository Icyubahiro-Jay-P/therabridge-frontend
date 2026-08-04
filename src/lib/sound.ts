import ding from "@/assets/ding.mp3"

let audioEl: HTMLAudioElement | null = null

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem("therabridge-settings")
    if (stored) {
      const s = JSON.parse(stored)
      return s[key] ?? fallback
    }
  } catch {
    return fallback
  }
  return fallback
}

function getAudio(): HTMLAudioElement {
  if (!audioEl) audioEl = new Audio(ding)
  return audioEl
}

// Effective volume for a message sound. The user's volume slider always
// applies; calm mode reduces it proportionally instead of pinning it, so the
// slider keeps working while calm mode still plays quieter.
function resolveVolume(): number {
  const volume = Math.max(0, Math.min(100, loadSetting("soundVolume", 70)))
  const calmFactor = loadSetting("calmMode", false) ? 0.3 : 1
  return (volume / 100) * calmFactor
}

function play(audio: HTMLAudioElement) {
  audio.volume = resolveVolume()
  audio.currentTime = 0
  void audio.play().catch(() => {})
}

export function playMessageSound() {
  if (!loadSetting("soundEnabled", true)) return
  play(getAudio())
}

export function playTestSound() {
  if (typeof window === "undefined") return
  play(getAudio())
}
