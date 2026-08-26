export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  return `${m} min`
}
