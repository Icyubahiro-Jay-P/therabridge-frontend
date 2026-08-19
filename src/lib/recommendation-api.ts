import { api } from "@/lib/api"

export type RecommendationType =
  | "exercise"
  | "assessment"
  | "gratitude"
  | "sleep"
  | "program"
  | "thought_record"

export type RecommendationPriority = "high" | "medium" | "low"

export interface Recommendation {
  id: number
  type: RecommendationType
  title: string
  description: string
  reason: string
  priority: RecommendationPriority
  actionUrl: string
  icon: string
}

export const recommendationApi = {
  get: () =>
    api
      .get<{ recommendations: Recommendation[] }>("/api/recommendations")
      .then((r) => r.data.recommendations),
}
