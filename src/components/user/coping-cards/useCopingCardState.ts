import { useState, useCallback, useRef } from "react"
import {
  copingCardApi,
  type CopingCard,
  type CopingCardCategory,
} from "@/lib/copingCard-api"
import { getErrorMessage } from "@/lib/errors"
import { runOptimistic } from "@/lib/optimistic"

export function useCopingCardState() {
  const [cards, setCards] = useState<CopingCard[]>([])
  const [filterCategory, setFilterCategory] = useState<CopingCardCategory | "">("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const lastFetchedCategory = useRef<string>("")

  const filteredCards = filterCategory
    ? cards.filter((c) => c.category === filterCategory)
    : cards

  const currentCard = filteredCards[currentIndex] ?? null

  const fetchCards = useCallback(async (category?: CopingCardCategory | "") => {
    const cat = category ?? filterCategory
    const key = cat || "__all__"
    if (lastFetchedCategory.current === key && cards.length > 0) return

    setLoading(true)
    setError(null)
    try {
      const params = cat ? { category: cat as CopingCardCategory } : undefined
      const res = await copingCardApi.list(params)
      setCards(res.cards)
      setCurrentIndex(0)
      lastFetchedCategory.current = key
    } catch {
      setError("Failed to load cards")
    } finally {
      setLoading(false)
    }
  }, [filterCategory, cards.length])

  const createCard = useCallback(async (text: string, category: CopingCardCategory) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const card = await copingCardApi.create({ text, category })
      setCards((prev) => [card, ...prev])
      lastFetchedCategory.current = ""
      setSuccess("Card created!")
      setShowCreate(false)
      return card
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create card"
      setError(msg)
      return null
    } finally {
      setSaving(false)
    }
  }, [])

  const toggleFavorite = useCallback(async (id: string) => {
    await runOptimistic({
      lockKey: `coping-card:favorite:${id}`,
      snapshot: () => cards.find((c) => c._id === id)?.isFavorite ?? false,
      apply: () =>
        setCards((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isFavorite: !c.isFavorite } : c))
        ),
      commit: async () => {
        const updated = await copingCardApi.toggleFavorite(id)
        lastFetchedCategory.current = ""
        return updated
      },
      reconcile: (data) => {
        const updated = data as CopingCard
        setCards((prev) => prev.map((c) => (c._id === id ? updated : c)))
      },
      rollback: (wasFavorite) =>
        setCards((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isFavorite: wasFavorite } : c))
        ),
      onError: (err) => setError(getErrorMessage(err)),
    })
  }, [cards])

  const deleteCard = useCallback(async (id: string) => {
    await runOptimistic({
      lockKey: `coping-card:delete:${id}`,
      snapshot: () => {
        const index = cards.findIndex((c) => c._id === id)
        return { index, card: index >= 0 ? cards[index] : null }
      },
      apply: () => {
        setCards((prev) => prev.filter((c) => c._id !== id))
        setCurrentIndex((prev) => Math.max(0, prev - 1))
        lastFetchedCategory.current = ""
      },
      commit: () => copingCardApi.delete(id),
      rollback: ({ index, card }) => {
        if (!card) return
        setCards((prev) => {
          if (prev.some((c) => c._id === id)) return prev
          const next = [...prev]
          next.splice(Math.min(index, next.length), 0, card)
          return next
        })
      },
      onError: (err) => setError(getErrorMessage(err)),
    })
  }, [cards])

  const shuffleCards = useCallback(() => {
    setCards((prev) => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    })
    setCurrentIndex(0)
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length)
  }, [filteredCards.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length)
  }, [filteredCards.length])

  const setFilter = useCallback((category: CopingCardCategory | "") => {
    setFilterCategory(category)
    setCurrentIndex(0)
    lastFetchedCategory.current = ""
  }, [])

  return {
    cards,
    filteredCards,
    currentCard,
    currentIndex,
    filterCategory,
    loading,
    saving,
    error,
    success,
    showCreate,
    setShowCreate,
    fetchCards,
    createCard,
    toggleFavorite,
    deleteCard,
    shuffleCards,
    goNext,
    goPrev,
    setFilter,
    setCurrentIndex,
    clearMessages: () => { setError(null); setSuccess(null) },
  }
}
