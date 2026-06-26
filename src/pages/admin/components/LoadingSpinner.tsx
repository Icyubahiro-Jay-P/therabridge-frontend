import { Loader2 } from "lucide-react"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center py-16 ${className ?? ""}`}>
      <Loader2 className="size-6 animate-spin text-gray-400" />
    </div>
  )
}
