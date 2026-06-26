import { User as UserIcon } from "lucide-react"

export function ClientsEmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <UserIcon className="size-12 text-gray-300" />
      <p className="text-sm text-gray-400">
        {search ? "No clients match your search." : "No conversations yet."}
      </p>
    </div>
  )
}
