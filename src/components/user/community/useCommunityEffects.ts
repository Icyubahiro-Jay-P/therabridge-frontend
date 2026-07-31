import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import { getErrorMessage } from "./utils"
import type { Community } from "./types"

export function useCommunityEffects(state: {
  inviteKey?: string
  communities: Community[]
  setCommunities: React.Dispatch<React.SetStateAction<Community[]>>
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setActive: (v: Community | null) => void
  active: Community | null
}) {
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      state.setLoading(true)
      try {
        const { data } = await api.get<Community[]>("/api/chat/communities")
        state.setCommunities(data)
      } catch (err) {
        state.setError(getErrorMessage(err))
      } finally {
        state.setLoading(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    if (!state.inviteKey) {
      state.setActive(null)
      return
    }
    const found = state.communities.find(
      (c) => c.inviteKey === state.inviteKey!.toUpperCase()
    )
    if (found) {
      state.setActive(found)
    } else {
      let mounted = true
      async function fetchByKey() {
        try {
          const { data } = await api.get<Community>(
            `/api/chat/communities/by-key/${state.inviteKey}`
          )
          if (mounted) {
            state.setActive(data)
            state.setCommunities((prev) =>
              prev.find((c) => c._id === data._id) ? prev : [...prev, data]
            )
          }
        } catch {
          if (mounted) state.setError("Community not found.")
        }
      }
      void fetchByKey()
      return () => { mounted = false }
    }
  }, [state.inviteKey, state.communities])

  useEffect(() => {
    if (state.active && state.inviteKey !== state.active.inviteKey) {
      navigate(`/community/${state.active.inviteKey}`, { replace: true })
    }
  }, [state.active, state.inviteKey, navigate])
}
