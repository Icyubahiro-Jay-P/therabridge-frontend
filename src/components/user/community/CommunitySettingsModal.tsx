import { useState } from "react"
import { TriangleAlert, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import { getErrorMessage } from "./utils"
import type { Community } from "./types"
import { SettingsForm } from "./SettingsForm"
import { MemberList } from "./MemberList"

export function CommunitySettingsModal({
  community,
  currentUserId,
  onClose,
  onUpdate,
}: {
  community: Community
  currentUserId: string
  onClose: () => void
  onUpdate: (c: Community) => void
}) {
  const isOwner = community.owner._id === currentUserId
  const [name, setName] = useState(community.name)
  const [description, setDescription] = useState(community.description)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleSave() {
    if (!isOwner) return
    setSaving(true)
    setError(null)
    try {
      const { data } = await api.put<Community>(`/api/chat/communities/${community._id}`, { name, description })
      onUpdate(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!isOwner) return
    setRemoving(userId)
    try {
      await api.post(`/api/chat/communities/${community._id}/members/remove`, { userId })
      onUpdate({ ...community, members: community.members.filter((m) => m._id !== userId) })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Community settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>
        <ScrollArea className="max-h-[70vh] p-6">
          <div className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <TriangleAlert className="inline size-4 shrink-0" /> {error}
              </div>
            )}
            <SettingsForm
              name={name} description={description} inviteKey={community.inviteKey}
              isOwner={isOwner} saving={saving}
              onNameChange={setName} onDescriptionChange={setDescription} onSave={handleSave}
            />
            <MemberList community={community} isOwner={isOwner} removing={removing} onRemoveMember={handleRemoveMember} />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
