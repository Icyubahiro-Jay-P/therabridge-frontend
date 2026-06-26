import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  avatarFile: File | null
  avatarUploading: boolean
  avatarMessage: string
  avatarError: string
  onRemove: () => void
  onUpload: () => void
}

export function AvatarUpload({
  avatarFile,
  avatarUploading,
  onRemove,
  onUpload,
}: Props) {
  if (!avatarFile) return null

  return (
    <Card>
      <CardContent className="flex items-center justify-between pt-6">
        <span className="truncate text-sm text-gray-600 dark:text-gray-400">
          {avatarFile.name}
        </span>
        <div className="flex gap-2">
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
                className="bg-emerald-600 hover:bg-emerald-700"
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
