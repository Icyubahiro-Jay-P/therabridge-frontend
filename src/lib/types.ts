export interface JournalEntry {
  _id: string
  user: string
  title: string
  content: string
  mood?: string | null
  tags?: string[]
  isPublic?: boolean
  comments: {
    _id: string
    user: string
    content: string
    createdAt: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface JournalListResponse {
  entries: JournalEntry[]
  total: number
  page: number
  pages: number
}
