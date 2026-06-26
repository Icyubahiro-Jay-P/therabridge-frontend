import type { ChatUser } from "../chat/types"

export interface CommunityMessage {
  _id: string
  sender: ChatUser
  content: string
  createdAt: string
  readBy: string[]
}

export interface Community {
  _id: string
  name: string
  description: string
  owner: ChatUser
  members: ChatUser[]
  inviteKey: string
  messages: CommunityMessage[]
}
