import { Bird, Heart, Pencil, BookOpen, UtensilsCrossed } from "lucide-react"
import { usePetState } from "./usePetState"
import { useEffect, useRef, useState } from "react"

const moodConfig = {
  happy: { emoji: "😊", label: "Happy", color: "text-emerald-500" },
  content: { emoji: "🙂", label: "Content", color: "text-sky-500" },
  sad: { emoji: "😢", label: "Sad", color: "text-amber-500" },
  neutral: { emoji: "😐", label: "Neutral", color: "text-gray-400" },
}

function petSize(level: number) {
  if (level >= 10) return "text-9xl"
  if (level >= 7) return "text-8xl"
  if (level >= 5) return "text-7xl"
  if (level >= 3) return "text-6xl"
  return "text-5xl"
}

export function PetPage() {
  const p = usePetState()
  const initializedRef = useRef(false)
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [showAdventures, setShowAdventures] = useState(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      p.fetchPet()
      p.fetchAdventures()
    }
  })

  const xpForNext = p.pet ? p.pet.level * 100 : 100
  const xpPercent = p.pet ? Math.min((p.pet.experience / xpForNext) * 100, 100) : 0
  const mood = p.pet ? moodConfig[p.pet.mood] : moodConfig.content

  const handleRename = async () => {
    if (nameInput.trim()) {
      await p.renamePet(nameInput.trim())
      setEditing(false)
    }
  }

  const startEdit = () => {
    setNameInput(p.pet?.name ?? "")
    setEditing(true)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {p.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {p.error}
        </div>
      )}
      {p.info && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
          {p.info}
        </div>
      )}
      {p.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          {p.success}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Companion</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your pet grows stronger with every self-care step you take!
        </p>
      </div>

      {p.loading && !p.pet && (
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-gray-400">Loading your companion...</div>
        </div>
      )}

      {p.pet && (
        <>
          <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50 to-sky-50 p-8 text-center dark:border-violet-900/50 dark:from-violet-950/30 dark:to-sky-950/30">
            {p.showLevelUp && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="animate-bounce rounded-2xl bg-yellow-400 px-6 py-3 text-lg font-bold text-yellow-900 shadow-lg dark:bg-yellow-500 dark:text-yellow-950">
                  Level Up! Level {p.levelUpLevel}
                </div>
              </div>
            )}

            <div className="mb-4 flex items-center justify-center">
              <div
                className={`animate-[float-y_3s_ease-in-out_infinite] ${petSize(p.pet.level)} transition-all duration-500`}
              >
                <Bird className="text-violet-600 dark:text-violet-400" strokeWidth={1.5} style={{ width: "1em", height: "1em" }} />
              </div>
            </div>

            {editing ? (
              <div className="mx-auto mb-3 flex max-w-xs items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={30}
                  autoFocus
                  className="flex-1 rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-center text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:border-violet-700 dark:bg-gray-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename()
                    if (e.key === "Escape") setEditing(false)
                  }}
                />
                <button
                  onClick={handleRename}
                  disabled={p.saving || !nameInput.trim()}
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="mb-3 flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{p.pet.name}</h2>
                <button
                  onClick={startEdit}
                  className="rounded-lg p-1 text-gray-400 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/40"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>
            )}

            <div className="mb-4 flex items-center justify-center gap-2">
              <span className={`text-sm font-medium ${mood.color}`}>
                {mood.emoji} {mood.label}
              </span>
            </div>

            <div className="mx-auto max-w-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Level {p.pet.level}</span>
                <span>{p.pet.experience} / {xpForNext} XP</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-linear-to-r from-violet-500 to-sky-500 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{p.pet.level}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{p.pet.experience}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">XP</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{p.adventures.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Adventures</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={p.feedPet}
              disabled={p.saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <UtensilsCrossed className="size-4" />
              {p.saving ? "Feeding..." : "Feed (+5 XP)"}
            </button>
            <button
              onClick={() => {
                setShowAdventures(!showAdventures)
                if (!showAdventures) p.fetchAdventures()
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:bg-violet-900/40"
            >
              <BookOpen className="size-4" />
              Adventure Log
            </button>
          </div>

          {showAdventures && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                <Heart className="mr-1 inline size-4 text-violet-500" />
                Adventures
              </h3>
              {p.adventures.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-8 text-center dark:border-gray-700 dark:bg-gray-900/50">
                  <p className="text-sm text-gray-400">
                    No adventures yet. Keep completing self-care activities!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...p.adventures].reverse().map((adv, i) => (
                    <div
                      key={`${adv.date}-${i}`}
                      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">{adv.text}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(adv.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            {p.pet.name} grows stronger with every self-care step you take.
          </p>
        </>
      )}
    </div>
  )
}
