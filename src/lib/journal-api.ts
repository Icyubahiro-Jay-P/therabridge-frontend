const API_BASE = import.meta.env.VITE_API_URL || "/api"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || "Request failed")
  return data as T
}

import type { JournalEntry, JournalListResponse } from "./types"

export function createEntry(payload: {
  title: string
  content: string
  mood?: string | null
  tags?: string[]
  isPublic?: boolean
}): Promise<JournalEntry> {
  return request("/journal", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getMyEntries(
  params?: { page?: number; limit?: number; mood?: string; tag?: string; search?: string },
): Promise<JournalListResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.set("page", String(params.page))
  if (params?.limit) query.set("limit", String(params.limit))
  if (params?.mood) query.set("mood", params.mood)
  if (params?.tag) query.set("tag", params.tag)
  if (params?.search) query.set("search", params.search)
  const qs = query.toString()
  return request(`/journal${qs ? `?${qs}` : ""}`)
}

export function getEntry(id: string): Promise<JournalEntry> {
  return request(`/journal/${id}`)
}

export function updateEntry(
  id: string,
  payload: {
    title?: string
    content?: string
    mood?: string | null
    tags?: string[]
    isPublic?: boolean
  },
): Promise<JournalEntry> {
  return request(`/journal/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deleteEntry(id: string): Promise<{ message: string }> {
  return request(`/journal/${id}`, { method: "DELETE" })
}

export function addComment(
  entryId: string,
  content: string,
): Promise<JournalEntry["comments"][0]> {
  return request(`/journal/${entryId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
}

export function deleteComment(
  entryId: string,
  commentId: string,
): Promise<{ message: string }> {
  return request(`/journal/${entryId}/comments/${commentId}`, {
    method: "DELETE",
  })
}

export function getPublicEntries(
  params?: { page?: number; limit?: number },
): Promise<JournalListResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.set("page", String(params.page))
  if (params?.limit) query.set("limit", String(params.limit))
  const qs = query.toString()
  return request(`/journal/public${qs ? `?${qs}` : ""}`)
}
