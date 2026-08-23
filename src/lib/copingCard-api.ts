import { api } from "@/lib/api"

export type CopingCardCategory =
  | "anxiety_coping"
  | "self_compassion"
  | "motivation"
  | "crisis_survival"
  | "gratitude"
  | "encouragement"
  | "custom"

export interface CopingCard {
  _id: string
  user: string
  text: string
  category: CopingCardCategory
  isFavorite: boolean
  isTemplate: boolean
  pointsEarned?: number
  createdAt: string
  updatedAt: string
}

export const COPING_CARD_CATEGORIES: { value: CopingCardCategory; label: string; color: string }[] = [
  { value: "anxiety_coping", label: "Anxiety Coping", color: "teal" },
  { value: "self_compassion", label: "Self-Compassion", color: "amber" },
  { value: "motivation", label: "Motivation", color: "amber" },
  { value: "crisis_survival", label: "Crisis Survival", color: "red" },
  { value: "gratitude", label: "Gratitude", color: "emerald" },
  { value: "encouragement", label: "Encouragement", color: "teal" },
  { value: "custom", label: "Custom", color: "gray" },
]

export const copingCardApi = {
  create: (data: { text: string; category: CopingCardCategory }) =>
    api.post<CopingCard>("/api/coping-cards", data).then((r) => r.data),

  list: (params?: { category?: CopingCardCategory }) =>
    api.get<{ cards: CopingCard[] }>("/api/coping-cards", { params }).then((r) => r.data),

  toggleFavorite: (id: string) =>
    api.patch<CopingCard>(`/api/coping-cards/${id}/favorite`).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/coping-cards/${id}`).then((r) => r.data),
}
