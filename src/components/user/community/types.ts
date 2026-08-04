import type { ChatUser, EditEntry } from "../chat/types"

export type CommunityCategory =
  | "general"
  | "anxiety"
  | "depression"
  | "stress"
  | "mindfulness"
  | "support"
  | "therapy"
  | "wellness"

export interface CommunityMessage {
  _id: string
  sender: ChatUser
  content: string
  createdAt: string
  readBy: string[]
  unsent?: boolean
  edited?: boolean
  editCount?: number
  editHistory?: EditEntry[]
}

export interface Community {
  _id: string
  name: string
  description: string
  owner: ChatUser
  members: ChatUser[]
  moderators: ChatUser[]
  pendingMembers: ChatUser[]
  inviteKey: string
  isPrivate: boolean
  category: CommunityCategory
  rules: string
  messages: CommunityMessage[]
}
