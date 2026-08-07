import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  avatarFile: File | null
  avatarPreview: string
  avatarUploading: boolean
  avatarMessage: string
  avatarError: string
  onRemove: () => void
  onUpload: () => void
}

export function AvatarUpload({
  avatarFile,
  avatarPreview,
  avatarUploading,
  onRemove,
  onUpload,
}: Props) {
  if (!avatarFile) return null

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Preview"
              className="size-12 shrink-0 rounded-full border object-cover sm:size-14"
            />
          )}
          <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-400">
            {avatarFile.name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          {avatarUploading ? (
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="size-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            <>
              <Button
                type="button"
                onClick={onUpload}
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 sm:flex-none"
              >
                Upload photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRemove}
              >
                <X className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
