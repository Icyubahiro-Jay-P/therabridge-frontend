import { useEffect, useState } from "react"
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
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    if (!avatarFile) { setPreviewUrl(""); return }
    const url = URL.createObjectURL(avatarFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [avatarFile])

  if (!avatarFile) return null

  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="size-14 rounded-full border object-cover"
          />
        )}
        <span className="truncate text-sm text-gray-600 dark:text-gray-400">
          {avatarFile.name}
        </span>
        <div className="ml-auto flex gap-2">
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
