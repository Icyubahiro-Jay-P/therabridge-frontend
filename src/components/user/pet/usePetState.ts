import { useState, useCallback } from "react"
import {
  petApi,
  type Pet,
  type PetAdventure,
} from "@/lib/pet-api"

export function usePetState() {
  const [pet, setPet] = useState<Pet | null>(null)
  const [adventures, setAdventures] = useState<PetAdventure[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState(0)

  const fetchPet = useCallback(async () => {
    setLoading(true)
    try {
      const data = await petApi.getMyPet()
      setPet(data)
    } catch {
      setError("Failed to load pet")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAdventures = useCallback(async () => {
    try {
      const data = await petApi.getAdventures()
      setAdventures(data.adventures)
    } catch {
      // non-critical
    }
  }, [])

  const feedPet = useCallback(async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await petApi.feed()
      setPet(result.pet)
      setSuccess(result.message)
      if (result.leveledUp) {
        setLevelUpLevel(result.pet.level)
        setShowLevelUp(true)
        setTimeout(() => setShowLevelUp(false), 3000)
      }
      return result
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to feed pet"
      setError(msg)
      return null
    } finally {
      setSaving(false)
    }
  }, [])

  const renamePet = useCallback(async (name: string) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await petApi.rename(name)
      setPet(updated)
      setSuccess("Renamed successfully!")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to rename"
      setError(msg)
    } finally {
      setSaving(false)
    }
  }, [])

  return {
    pet,
    adventures,
    loading,
    saving,
    error,
    success,
    showLevelUp,
    levelUpLevel,
    fetchPet,
    fetchAdventures,
    feedPet,
    renamePet,
    clearMessages: () => {
      setError(null)
      setSuccess(null)
    },
  }
}
