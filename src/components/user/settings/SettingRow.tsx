export function SettingRow({ icon: Icon, label, description, children }: { icon: React.ElementType; label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3.5 dark:border-gray-700/60">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <Icon className="size-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
