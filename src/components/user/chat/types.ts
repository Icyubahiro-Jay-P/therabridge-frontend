export interface ChatUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  avatar?: string | null
}

export interface EditEntry {
  content: string
  editedAt: string
}

export interface DirectMessage {
  _id: string
  sender: ChatUser
  recipient: ChatUser
  content: string
  read: boolean
  readAt?: string
  createdAt: string
  unsent?: boolean
  edited?: boolean
  editCount?: number
  editHistory?: EditEntry[]
}

export interface Conversation {
  partner: ChatUser
  lastMessage: DirectMessage
  unread: number
}
