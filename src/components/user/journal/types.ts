export interface JournalComment {
  _id: string
  author: {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatar?: string | null
  }
  content: string
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  _id: string
  user: string
  title: string
  content: string
  mood?: "great" | "good" | "okay" | "bad" | "terrible" | null
  tags: string[]
  isPublic: boolean
  comments: JournalComment[]
  createdAt: string
  updatedAt: string
}

export interface JournalListResponse {
  entries: JournalEntry[]
  hasMore: boolean
}
