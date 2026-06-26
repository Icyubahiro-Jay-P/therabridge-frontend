import type { ChatUser, EditEntry } from "../chat/types"

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
  inviteKey: string
  messages: CommunityMessage[]
}
