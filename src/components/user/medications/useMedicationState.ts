import { useState, useCallback, useRef } from "react"
import { medicationApi } from "@/lib/medication-api"
import type { Medication, MedicationLog, AdherenceStats } from "./types"

export function useMedicationState() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [activeMedications, setActiveMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Add/Edit form
  const [formOpen, setFormOpen] = useState(false)
  const [editingMed, setEditingMed] = useState<Medication | null>(null)
  const [formName, setFormName] = useState("")
  const [formDosage, setFormDosage] = useState("")
  const [formFrequency, setFormFrequency] = useState<string>("daily")
  const [formTimeOfDay, setFormTimeOfDay] = useState("08:00")
  const [formStartDate, setFormStartDate] = useState("")
  const [formEndDate, setFormEndDate] = useState("")
  const [formNotes, setFormNotes] = useState("")

  // Logs
  const [logs, setLogs] = useState<MedicationLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsHasMore, setLogsHasMore] = useState(false)

  // Stats
  const [stats, setStats] = useState<AdherenceStats | null>(null)

  // Side effect modal
  const [sideEffectModalOpen, setSideEffectModalOpen] = useState(false)
  const [pendingLogMedication, setPendingLogMedication] = useState<Medication | null>(null)
  const [sideEffects, setSideEffects] = useState<string[]>([])
  const [sideEffectInput, setSideEffectInput] = useState("")
  const [logNotes, setLogNotes] = useState("")

  const fetchVersionRef = useRef(0)

  const fetchMedications = useCallback(async () => {
    const version = ++fetchVersionRef.current
    setLoading(true)
    setLoadError(null)
    try {
      const [allData, activeData] = await Promise.all([
        medicationApi.list(),
        medicationApi.list({ active: true }),
      ])
      if (version !== fetchVersionRef.current) return
      setMedications(allData.medications)
      setActiveMedications(activeData.medications)
    } catch (err) {
      if (version !== fetchVersionRef.current) return
      setLoadError(err instanceof Error ? err.message : "Failed to load medications")
    } finally {
      if (version === fetchVersionRef.current) setLoading(false)
    }
  }, [])

  const openForm = useCallback((med?: Medication) => {
    if (med) {
      setEditingMed(med)
      setFormName(med.name)
      setFormDosage(med.dosage)
      setFormFrequency(med.frequency)
      setFormTimeOfDay(med.timeOfDay || "08:00")
      setFormStartDate(med.startDate ? med.startDate.slice(0, 10) : "")
      setFormEndDate(med.endDate ? med.endDate.slice(0, 10) : "")
      setFormNotes(med.notes || "")
    } else {
      setEditingMed(null)
      setFormName("")
      setFormDosage("")
      setFormFrequency("daily")
      setFormTimeOfDay("08:00")
      setFormStartDate(new Date().toISOString().slice(0, 10))
      setFormEndDate("")
      setFormNotes("")
    }
    setFormOpen(true)
    setError(null)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingMed(null)
    setError(null)
  }, [])

  const saveMedication = useCallback(async () => {
    if (!formName.trim() || !formDosage.trim()) {
      setError("Name and dosage are required")
      return
    }
    try {
      setSaving(true)
      setError(null)
      const payload = {
        name: formName.trim(),
        dosage: formDosage.trim(),
        frequency: formFrequency,
        timeOfDay: formTimeOfDay || null,
        startDate: formStartDate || undefined,
        endDate: formEndDate || null,
        notes: formNotes.trim() || null,
      }
      if (editingMed) {
        const updated = await medicationApi.update(editingMed._id, payload)
        setMedications((prev) => prev.map((m) => (m._id === updated._id ? updated : m)))
        setActiveMedications((prev) => {
          const exists = prev.find((m) => m._id === updated._id)
          if (updated.active) {
            return exists ? prev.map((m) => (m._id === updated._id ? updated : m)) : [...prev, updated]
          }
          return prev.filter((m) => m._id !== updated._id)
        })
      } else {
        const created = await medicationApi.create(payload)
        setMedications((prev) => [created, ...prev])
        if (created.active) setActiveMedications((prev) => [created, ...prev])
      }
      setFormOpen(false)
      setEditingMed(null)
      setSuccess(editingMed ? "Medication updated" : "Medication added")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save medication")
    } finally {
      setSaving(false)
    }
  }, [formName, formDosage, formFrequency, formTimeOfDay, formStartDate, formEndDate, formNotes, editingMed])

  const removeMedication = useCallback(async (id: string) => {
    try {
      await medicationApi.delete(id)
      setMedications((prev) => prev.filter((m) => m._id !== id))
      setActiveMedications((prev) => prev.filter((m) => m._id !== id))
      setSuccess("Medication deleted")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete medication")
    }
  }, [])

  const openSideEffectModal = useCallback((med: Medication) => {
    setPendingLogMedication(med)
    setSideEffects([])
    setSideEffectInput("")
    setLogNotes("")
    setSideEffectModalOpen(true)
  }, [])

  const closeSideEffectModal = useCallback(() => {
    setSideEffectModalOpen(false)
    setPendingLogMedication(null)
    setSideEffects([])
    setSideEffectInput("")
    setLogNotes("")
  }, [])

  const addSideEffect = useCallback(() => {
    const trimmed = sideEffectInput.trim()
    if (trimmed && sideEffects.length < 10 && !sideEffects.includes(trimmed)) {
      setSideEffects((prev) => [...prev, trimmed])
      setSideEffectInput("")
    }
  }, [sideEffectInput, sideEffects])

  const removeSideEffect = useCallback((idx: number) => {
    setSideEffects((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const logDose = useCallback(async (skipped = false, medicationOverride?: Medication) => {
    const med = medicationOverride || pendingLogMedication
    if (!med) return
    try {
      setSaving(true)
      setError(null)
      const log = await medicationApi.logDose({
        medicationId: med._id,
        skipped,
        sideEffects: skipped ? [] : sideEffects,
        notes: logNotes.trim() || null,
      })
      setLogs((prev) => [log, ...prev])
      if (!medicationOverride) {
        setSideEffectModalOpen(false)
        setPendingLogMedication(null)
      }
      setSuccess(skipped ? "Dose marked as skipped" : "Dose logged! +2 points")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log dose")
    } finally {
      setSaving(false)
    }
  }, [pendingLogMedication, sideEffects, logNotes, medicationApi])

  const fetchLogs = useCallback(async (opts: { page?: number; medicationId?: string; append?: boolean }) => {
    setLogsLoading(true)
    try {
      const data = await medicationApi.getLogs({
        page: opts.page ?? 1,
        limit: 20,
        medicationId: opts.medicationId,
      })
      setLogs((prev) => (opts.append ? [...prev, ...data.logs] : data.logs))
      setLogsHasMore(data.hasMore)
    } catch {
      // non-critical
    } finally {
      setLogsLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async (medicationId?: string) => {
    try {
      const data = await medicationApi.getStats({ medicationId, days: 30 })
      setStats(data)
    } catch {
      // non-critical
    }
  }, [])

  return {
    medications, activeMedications, loading, loadError,
    saving, error, success, setError, setSuccess,
    formOpen, editingMed,
    formName, setFormName,
    formDosage, setFormDosage,
    formFrequency, setFormFrequency,
    formTimeOfDay, setFormTimeOfDay,
    formStartDate, setFormStartDate,
    formEndDate, setFormEndDate,
    formNotes, setFormNotes,
    openForm, closeForm, saveMedication, removeMedication,
    sideEffectModalOpen, pendingLogMedication,
    sideEffects, sideEffectInput, setSideEffectInput,
    logNotes, setLogNotes,
    openSideEffectModal, closeSideEffectModal,
    addSideEffect, removeSideEffect, logDose,
    logs, logsLoading, logsHasMore, fetchLogs,
    stats, fetchStats,
    fetchMedications,
  }
}
