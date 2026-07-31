import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
