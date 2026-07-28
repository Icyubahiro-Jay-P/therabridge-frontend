/**
 * Skeleton Loader Components
 * Display placeholder animations while content is loading
 */

export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-lg border p-4 dark:border-gray-700">
      <div className="h-40 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

export function UserCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-lg border p-4 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b dark:border-gray-700">
      <td className="p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </td>
    </tr>
  )
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
        ></div>
      ))}
    </div>
  )
}

export function GridSkeleton({
  columns = 3,
  count = 6,
}: {
  columns?: number
  count?: number
}) {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
