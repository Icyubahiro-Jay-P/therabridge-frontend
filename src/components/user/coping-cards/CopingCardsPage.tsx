import { useEffect, useRef, useState } from "react"
import {
  Layers, Star, Plus, Shuffle, ChevronLeft, ChevronRight,
  X, Send, Sparkles, Heart, Flame, Zap, Shield, Sun, Trophy,
} from "lucide-react"
import { useCopingCardState } from "./useCopingCardState"
import {
  COPING_CARD_CATEGORIES,
  type CopingCardCategory,
  type CopingCard,
} from "@/lib/copingCard-api"

const CATEGORY_META: Record<
  CopingCardCategory,
  { icon: React.ReactNode; accent: string; ring: string; bg: string; text: string }
> = {
  anxiety_coping: {
    icon: <Shield className="size-4" />,
    accent: "sky",
    ring: "ring-sky-300 dark:ring-sky-600",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
  },
  self_compassion: {
    icon: <Heart className="size-4" />,
    accent: "rose",
    ring: "ring-rose-300 dark:ring-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
  },
  motivation: {
    icon: <Zap className="size-4" />,
    accent: "amber",
    ring: "ring-amber-300 dark:ring-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  crisis_survival: {
    icon: <Flame className="size-4" />,
    accent: "red",
    ring: "ring-red-300 dark:ring-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
  },
  gratitude: {
    icon: <Sun className="size-4" />,
    accent: "emerald",
    ring: "ring-emerald-300 dark:ring-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  encouragement: {
    icon: <Trophy className="size-4" />,
    accent: "violet",
    ring: "ring-violet-300 dark:ring-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
  },
  custom: {
    icon: <Sparkles className="size-4" />,
    accent: "gray",
    ring: "ring-gray-300 dark:ring-gray-600",
    bg: "bg-gray-50 dark:bg-gray-800/40",
    text: "text-gray-700 dark:text-gray-300",
  },
}

function CardView({
  card,
  onToggleFavorite,
  onDelete,
}: {
  card: CopingCard
  onToggleFavorite: () => void
  onDelete?: () => void
}) {
  const meta = CATEGORY_META[card.category]
  return (
    <div className={`relative flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900 ${meta.ring} ring-2`}>
      <div className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}>
        {meta.icon}
        {COPING_CARD_CATEGORIES.find((c) => c.value === card.category)?.label}
      </div>
      <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white sm:text-xl">
        {card.text}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onToggleFavorite}
          className={`rounded-full p-2 transition-colors ${
            card.isFavorite
              ? "text-amber-500 hover:text-amber-600"
              : "text-gray-300 hover:text-amber-400 dark:text-gray-600 dark:hover:text-amber-500"
          }`}
          aria-label={card.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`size-5 ${card.isFavorite ? "fill-current" : ""}`} />
        </button>
        {!card.isTemplate && onDelete && (
          <button
            onClick={onDelete}
            className="rounded-full p-2 text-gray-300 transition-colors hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400"
            aria-label="Delete card"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      {card.isTemplate && (
        <span className="absolute top-3 right-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          Template
        </span>
      )}
    </div>
  )
}

function CreateCardForm({
  onSubmit,
  onClose,
  saving,
}: {
  onSubmit: (text: string, category: CopingCardCategory) => Promise<unknown>
  onClose: () => void
  saving: boolean
}) {
  const [text, setText] = useState("")
  const [category, setCategory] = useState<CopingCardCategory>("anxiety_coping")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async () => {
    if (!text.trim()) return
    await onSubmit(text.trim(), category)
    setText("")
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Create a Card</h3>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="size-4" />
        </button>
      </div>
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={300}
        rows={3}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder="Write your affirmation or coping statement..."
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {COPING_CARD_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat.value]
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                category === cat.value
                  ? `${meta.bg} ${meta.text} ring-1 ${meta.ring}`
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {meta.icon}
              {cat.label}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{text.length}/300</span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || saving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          <Send className="size-3.5" />
          {saving ? "Creating..." : "Create Card"}
        </button>
      </div>
    </div>
  )
}

export function CopingCardsPage() {
  const s = useCopingCardState()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      s.fetchCards()
    }
  })

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coping Cards</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Affirmations and coping statements for in-the-moment support.
          </p>
        </div>
        <button
          onClick={() => s.setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="size-4" />
          New Card
        </button>
      </div>

      {s.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          {s.success}
        </div>
      )}

      {s.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {s.error}
        </div>
      )}

      {s.showCreate && (
        <CreateCardForm
          onSubmit={s.createCard}
          onClose={() => s.setShowCreate(false)}
          saving={s.saving}
        />
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => s.setFilter("")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            s.filterCategory === ""
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
        {COPING_CARD_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat.value]
          const count = s.cards.filter((c) => c.category === cat.value).length
          return (
            <button
              key={cat.value}
              onClick={() => s.setFilter(cat.value)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                s.filterCategory === cat.value
                  ? `${meta.bg} ${meta.text} ring-1 ${meta.ring}`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {meta.icon}
              {cat.label}
              {count > 0 && (
                <span className="ml-0.5 rounded-full bg-black/10 px-1.5 text-[10px] dark:bg-white/10">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {s.loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Layers className="size-8 animate-pulse text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-400">Loading cards...</p>
          </div>
        </div>
      ) : s.filteredCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Layers className="mb-4 size-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">No cards yet.</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Create your first coping card or browse templates above.
          </p>
        </div>
      ) : (
        <>
          {/* Card Deck Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={s.goPrev}
                disabled={s.filteredCards.length <= 1}
                className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Previous card"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs tabular-nums text-gray-400">
                {s.filteredCards.length > 0 ? `${s.currentIndex + 1} / ${s.filteredCards.length}` : "0 / 0"}
              </span>
              <button
                onClick={s.goNext}
                disabled={s.filteredCards.length <= 1}
                className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Next card"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <button
              onClick={s.shuffleCards}
              disabled={s.filteredCards.length <= 1}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Shuffle className="size-3.5" />
              Shuffle
            </button>
          </div>

          {/* Current Card View */}
          {s.currentCard && (
            <CardView
              key={s.currentCard._id}
              card={s.currentCard}
              onToggleFavorite={() => s.toggleFavorite(s.currentCard!._id)}
              onDelete={
                !s.currentCard.isTemplate
                  ? () => s.deleteCard(s.currentCard!._id)
                  : undefined
              }
            />
          )}

          {/* Grid Preview */}
          {s.filteredCards.length > 1 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                All Cards
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {s.filteredCards.map((card, i) => {
                  const meta = CATEGORY_META[card.category]
                  return (
                    <button
                      key={card._id}
                      onClick={() => s.setCurrentIndex(i)}
                      className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                        i === s.currentIndex
                          ? `border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300 dark:border-emerald-700 dark:bg-emerald-950/30 dark:ring-emerald-700`
                          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.text}`}>
                        {meta.icon}
                        {COPING_CARD_CATEGORIES.find((c) => c.value === card.category)?.label}
                      </div>
                      <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                        {card.text}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {card.isFavorite && (
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        )}
                        {card.isTemplate && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            Template
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
