import { api } from "@/lib/api"

export interface ThoughtRecord {
  _id: string
  user: string
  situation: string
  automaticThought: string
  emotions: string
  emotionIntensity: number
  distortionType: string
  evidenceFor: string
  evidenceAgainst: string
  reframe: string
  outcomeEmotion: string
  outcomeIntensity: number | null
  mood: "great" | "good" | "okay" | "bad" | "terrible" | null
  pointsEarned?: number
  createdAt: string
  updatedAt: string
}

export interface ThoughtRecordListResponse {
  records: ThoughtRecord[]
  hasMore: boolean
}

export interface ThoughtRecordStats {
  totalRecords: number
  recentRecords: number
  distortionBreakdown: { type: string; count: number }[]
  avgEmotionBefore: number | null
  avgEmotionAfter: number | null
}

export const thoughtRecordApi = {
  create: (data: {
    situation: string
    automaticThought: string
    emotions: string
    emotionIntensity: number
    distortionType?: string
    evidenceFor?: string
    evidenceAgainst?: string
    reframe: string
    outcomeEmotion?: string
    outcomeIntensity?: number
    mood?: string
  }) => api.post<ThoughtRecord>("/thought-records", data).then((r) => r.data),

  list: (params?: { page?: number; limit?: number; distortion?: string; mood?: string; search?: string }) =>
    api.get<ThoughtRecordListResponse>("/thought-records", { params }).then((r) => r.data),

  get: (id: string) => api.get<ThoughtRecord>(`/thought-records/${id}`).then((r) => r.data),

  update: (id: string, data: Partial<{
    situation: string
    automaticThought: string
    emotions: string
    emotionIntensity: number
    distortionType: string
    evidenceFor: string
    evidenceAgainst: string
    reframe: string
    outcomeEmotion: string
    outcomeIntensity: number
    mood: string
  }>) => api.put<ThoughtRecord>(`/thought-records/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/thought-records/${id}`).then((r) => r.data),

  stats: () => api.get<ThoughtRecordStats>("/thought-records/stats").then((r) => r.data),
}
