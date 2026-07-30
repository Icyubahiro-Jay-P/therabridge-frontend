import { useCallback, useState } from "react"

/**
 * Hook for optimistic rendering
 * Updates UI immediately while request is in flight
 * Rolls back if the request fails
 */
export function useOptimisticMutation<T, E = Error>(
  mutationFn: (data: T) => Promise<any>
) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<E | null>(null)

  const mutate = useCallback(
    async (data: T, onOptimisticUpdate: () => void, onRollback: () => void) => {
      try {
        setIsPending(true)
        setError(null)

        // Update UI immediately (optimistic)
        onOptimisticUpdate()

        // Make the actual request
        await mutationFn(data)
      } catch (err) {
        setError(err as E)
        // Rollback on failure
        onRollback()
      } finally {
        setIsPending(false)
      }
    },
    [mutationFn]
  )

  return { mutate, isPending, error }
}

/**
 * Example usage:
 *
 * function LikeButton() {
 *   const [liked, setLiked] = useState(false)
 *   const { mutate, isPending } = useOptimisticMutation(likePost)
 *
 *   const handleLike = () => {
 *     mutate(
 *       { postId: '123' },
 *       () => setLiked(true),  // Optimistic update
 *       () => setLiked(false)  // Rollback
 *     )
 *   }
 *
 *   return <button onClick={handleLike}>{liked ? '❤️' : '🤍'}</button>
 * }
 */
