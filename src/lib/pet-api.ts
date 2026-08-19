import { api } from "@/lib/api"

export interface PetAdventure {
  text: string
  date: string
}

export interface Pet {
  _id: string
  user: string
  name: string
  level: number
  experience: number
  mood: "happy" | "content" | "sad" | "neutral"
  hunger: number
  accessories: string[]
  adventureLog: PetAdventure[]
  lastFedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ActivityResult {
  pet: Pet
  xpGain: number
  leveledUp: boolean
  adventureTriggered: boolean
  adventureText: string | null
  message: string
}

export interface FeedResult {
  pet: Pet
  leveledUp: boolean
  message: string
}

export const petApi = {
  getMyPet: () =>
    api.get<Pet>("/api/pet").then((r) => r.data),

  feed: () =>
    api.post<FeedResult>("/api/pet/feed", {}, {
      headers: { "Idempotency-Key": `pet-feed-${Date.now()}` },
    }).then((r) => r.data),

  rename: (name: string) =>
    api.put<Pet>("/api/pet/rename", { name }).then((r) => r.data),

  getAdventures: () =>
    api.get<{ adventures: PetAdventure[] }>("/api/pet/adventures").then((r) => r.data),

  checkActivity: (activityType: string) =>
    api.post<ActivityResult>("/api/pet/activity", { activityType }, {
      headers: { "Idempotency-Key": `pet-activity-${activityType}-${Date.now()}` },
    }).then((r) => r.data),
}
