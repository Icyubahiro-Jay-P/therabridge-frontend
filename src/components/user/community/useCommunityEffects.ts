import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCommunityStore } from "@/store/community-store"
import { api } from "@/lib/api"
import { getErrorMessage } from "./utils"
import type { Community } from "./types"

export function useCommunityEffects() {
  const navigate = useNavigate()

  const inviteKey = useCommunityStore((s) => s.inviteKey)
  const communities = useCommunityStore((s) => s.communities)
  const active = useCommunityStore((s) => s.active)
  const setCommunities = useCommunityStore((s) => s.setCommunities)
  const setLoading = useCommunityStore((s) => s.setLoading)
  const setError = useCommunityStore((s) => s.setError)
  const setActive = useCommunityStore((s) => s.setActive)

  // ── Load communities ──
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

  // ── Resolve active community from inviteKey ──
  useEffect(() => {
    if (!inviteKey) {
      setActive(null)
      return
    }
    const found = communities.find(
      (c) => c.inviteKey === inviteKey.toUpperCase(),
    )
    if (found) {
      setActive(found)
    } else {
      let mounted = true
      async function fetchByKey() {
        try {
          const { data } = await api.get<Community>(
            `/api/chat/communities/by-key/${inviteKey}`,
          )
          if (mounted) {
            setActive(data)
            setCommunities((prev) =>
              prev.find((c) => c._id === data._id) ? prev : [...prev, data],
            )
          }
        } catch (err: unknown) {
          if (mounted) {
            const axiosErr = err as { response?: { data?: { error?: { code?: string; message?: string } } } }
            const code = axiosErr?.response?.data?.error?.code
            if (code === "PENDING_APPROVAL") {
              setError("Your join request is pending approval.")
            } else {
              setError("Community not found.")
            }
          }
        }
      }
      void fetchByKey()
      return () => { mounted = false }
    }
  }, [inviteKey, communities, setActive, setCommunities, setError])

  // ── Navigate when active community changes ──
  useEffect(() => {
    if (active && inviteKey !== active.inviteKey) {
      navigate(`/community/${active.inviteKey}`, { replace: true })
    }
  }, [active, inviteKey, navigate])

  // ── Navigate after leave/delete ──
  useEffect(() => {
    if (!active && inviteKey) {
      navigate("/community")
    }
  }, [active, inviteKey, navigate])
}
