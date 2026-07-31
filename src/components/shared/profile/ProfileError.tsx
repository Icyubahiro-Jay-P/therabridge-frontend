import { useNavigate } from "react-router-dom"
import { ArrowLeft, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProfileError({ error }: { error: string }) {
  const navigate = useNavigate()
  return (
    <div className="space-y-4 p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="size-4" /> Back
      </Button>
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
        <TriangleAlert className="size-4 shrink-0" />
        {error}
      </div>
    </div>
  )
}
