import { useState } from "react"
import { Image, Camera, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Modal } from "@/components/ui/modal"
import { ConfirmModal } from "@/components/admin/ConfirmModal"

interface Props {
  avatarUrl?: string
  name?: string
  size?: string
  isOwner?: boolean
  onUpdate?: () => void
  onRemove?: () => Promise<void>
}

export default function AvatarActions({
  avatarUrl,
  name,
  size = "size-24",
  isOwner = false,
  onUpdate,
  onRemove,
}: Props) {
  const [viewOpen, setViewOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const hasAvatar = !!avatarUrl

  async function confirmRemove() {
    setConfirmOpen(false)
    if (onRemove) await onRemove()
  }

  const avatar = (
    <Avatar
      className={`${size} border-2 border-gray-200 shadow-sm dark:border-gray-700`}
    >
      {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
        {/* fallback icon handled by AvatarFallback */}
      </AvatarFallback>
    </Avatar>
  )

  if (isOwner) {
    return (
      <div className="relative shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Profile picture options"
              className="rounded-full"
            >
              {avatar}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <Image className="size-4" />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdate?.()}>
              <Camera className="size-4" />
              <span>Update</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setConfirmOpen(true)}
              disabled={!hasAvatar} // visually destructive intent handled by icon/text
              // visually destructive intent handled by icon/text
            >
              <Trash2 className={`${hasAvatar ? "" : "opacity-50"} size-4`} />
              <span className={`${hasAvatar ? "" : "opacity-50"}`}>Remove</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ConfirmModal
          open={confirmOpen}
          title="Remove profile picture"
          description={
            "This will revert your profile picture to the default avatar. This action can be undone by uploading a new picture."
          }
          confirmLabel="Remove"
          loading={false}
          onConfirm={confirmRemove}
          onCancel={() => setConfirmOpen(false)}
        />

        {viewOpen && (
          <Modal open onClose={() => setViewOpen(false)} panelClassName="max-h-full max-w-full bg-transparent p-0 shadow-none">
              <button
                onClick={() => setViewOpen(false)}
                className="mb-4 rounded bg-white/30 px-3 py-1 text-sm"
              >
                Close
              </button>
              <img
                src={avatarUrl}
                alt={name || "Avatar"}
                className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain"
              />
          </Modal>
        )}
      </div>
    )
  }

  // public view: clicking avatar opens viewer
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setViewOpen(true)}
        aria-label="View profile picture"
      >
        {avatar}
      </button>

      {viewOpen && (
        <Modal open onClose={() => setViewOpen(false)} panelClassName="max-h-full max-w-full bg-transparent p-0 shadow-none">
            <button
              onClick={() => setViewOpen(false)}
              className="mb-4 rounded bg-white/30 px-3 py-1 text-sm"
            >
              Close
            </button>
            <img
              src={avatarUrl}
              alt={name || "Avatar"}
              className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain"
            />
        </Modal>
      )}
    </div>
  )
}
