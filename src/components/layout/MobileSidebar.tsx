import { Menu } from "lucide-react"

export function MobileSidebar({
  mobileOpen, isHidden, closeMobile, onOpenMobile,
}: {
  mobileOpen: boolean
  isHidden: boolean
  closeMobile: () => void
  onOpenMobile: () => void
}) {
  return (
    <>
      {isHidden && mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={closeMobile} />
      )}
      {isHidden && !mobileOpen && (
        <button
          onClick={onOpenMobile}
          className="fixed bottom-4 left-4 z-50 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
        >
          <Menu className="size-5" />
        </button>
      )}
    </>
  )
}
