export function MobileSidebar({
  mobileOpen,
  isHidden,
  closeMobile,
}: {
  mobileOpen: boolean
  isHidden: boolean
  closeMobile: () => void
}) {
  return (
    <>
      {isHidden && mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={closeMobile} />
      )}
    </>
  )
}
