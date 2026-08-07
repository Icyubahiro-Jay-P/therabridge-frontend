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
  const { inviteKey, communities, active, setCommunities, setLoading, setError, setActive } = state

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await api.get<Community[]>("/api/chat/communities")
        setCommunities(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [setCommunities, setLoading, setError])

  useEffect(() => {
    if (!inviteKey) {
      setActive(null)
      return
    }
    const found = communities.find(
      (c) => c.inviteKey === inviteKey!.toUpperCase()
    )
    if (found) {
      setActive(found)
    } else {
      let mounted = true
      async function fetchByKey() {
        try {
          const { data } = await api.get<Community>(
            `/api/chat/communities/by-key/${inviteKey}`
          )
          if (mounted) {
            setActive(data)
            setCommunities((prev) =>
              prev.find((c) => c._id === data._id) ? prev : [...prev, data]
            )
          }
        } catch {
          if (mounted) setError("Community not found.")
        }
      }
      void fetchByKey()
      return () => { mounted = false }
    }
  }, [inviteKey, communities, setActive, setCommunities, setError])

  useEffect(() => {
    if (active && inviteKey !== active.inviteKey) {
      navigate(`/community/${active.inviteKey}`, { replace: true })
    }
  }, [active, inviteKey, navigate])
}
