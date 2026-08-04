import { useState } from "react"
import { LogOut, Trash2, TriangleAlert, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import { getErrorMessage } from "./utils"
import type { Community, CommunityCategory } from "./types"
import { SettingsForm } from "./SettingsForm"
import { MemberList } from "./MemberList"
import { JoinRequests } from "./JoinRequests"
import { ModeratorsSection } from "./ModeratorsSection"

export function CommunitySettingsModal({
  community,
  currentUserId,
  canModerate,
  canLeave,
  onClose,
  onUpdate,
  onLeave,
  onDelete,
}: {
  community: Community
  currentUserId: string
  canModerate: boolean
  canLeave: boolean
  onClose: () => void
  onUpdate: (c: Community) => void
  onLeave: () => void
  onDelete: () => void
}) {
  const isOwner = community.owner._id === currentUserId
  const [name, setName] = useState(community.name)
  const [description, setDescription] = useState(community.description)
  const [category, setCategory] = useState<CommunityCategory>(community.category ?? "general")
  const [isPrivate, setIsPrivate] = useState(community.isPrivate ?? false)
  const [rules, setRules] = useState(community.rules ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  async function handleSave() {
    if (!isOwner) return
    setSaving(true)
    setError(null)
    try {
      const { data } = await api.put<Community>(`/api/chat/communities/${community._id}`, {
        name,
        description,
        category,
        isPrivate,
        rules,
      })
      onUpdate(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleRemoveMember(userId: string) {
    setRemoving(userId)
    setError(null)
    try {
      await api.post(`/api/chat/communities/${community._id}/members/remove`, { userId })
      onUpdate({
        ...community,
        members: community.members.filter((m) => m._id !== userId),
        moderators: community.moderators.filter((m) => m._id !== userId),
      })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setRemoving(null)
    }
  }

  async function handleRespond(userId: string, action: "approve" | "reject") {
    setBusy(userId)
    setError(null)
    try {
      const { data } = await api.post<{ message: string; community: Community }>(
        `/api/chat/communities/${community._id}/join-requests/${userId}`,
        { action }
      )
      onUpdate(data.community)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  async function handleToggleModerator(userId: string, makeModerator: boolean) {
    setBusy(userId)
    setError(null)
    try {
      const { data } = await api.post<{ moderators: Community["moderators"] }>(
        makeModerator
          ? `/api/chat/communities/${community._id}/moderators`
          : `/api/chat/communities/${community._id}/moderators/remove`,
        { userId }
      )
      onUpdate({ ...community, moderators: data.moderators })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(null)
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

            {canModerate && (
              <JoinRequests
                requests={community.pendingMembers ?? []}
                busy={busy}
                onApprove={(id) => handleRespond(id, "approve")}
                onReject={(id) => handleRespond(id, "reject")}
              />
            )}

            <SettingsForm
              name={name}
              description={description}
              category={category}
              isPrivate={isPrivate}
              rules={rules}
              inviteKey={community.inviteKey}
              isOwner={isOwner}
              saving={saving}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
              onIsPrivateChange={setIsPrivate}
              onRulesChange={setRules}
              onSave={handleSave}
            />

            {canModerate && (
              <ModeratorsSection
                community={community}
                isOwner={isOwner}
                busy={busy}
                onToggle={handleToggleModerator}
              />
            )}

            {canModerate && (
              <MemberList
                community={community}
                canModerate={canModerate}
                removing={removing}
                onRemoveMember={handleRemoveMember}
              />
            )}

            {canLeave && (
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLeave}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="size-4" /> Leave community
                </Button>
              </div>
            )}

            {isOwner && (
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="size-4" /> Delete community
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
