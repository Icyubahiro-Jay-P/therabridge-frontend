export interface ChatUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  avatar?: string | null
  isDisabled?: boolean
}

export interface EditEntry {
  content: string
  editedAt: string
}

export interface ReplySnapshot {
  _id: string
  senderUsername: string
  senderAvatar?: string | null
  content: string
  type?: "text" | "voice"
}

export interface DirectMessage {
  _id: string
  sender: ChatUser
  recipient: ChatUser
  content: string
  read: boolean
  readAt?: string
  createdAt: string
  kind?: "message" | "screenshot-notice"
  noticeType?: string | null
  unsent?: boolean
  edited?: boolean
  editCount?: number
  editHistory?: EditEntry[]
  type?: "text" | "voice"
  audioUrl?: string | null
  duration?: number | null
  replyTo?: ReplySnapshot
}

export interface Conversation {
  partner: ChatUser
  lastMessage: DirectMessage
  unread: number
}
