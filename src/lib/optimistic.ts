// ============================================================================
// OPTIMISTIC UI ENGINE
//
// Lets simple actions (favorite toggles, deletes, mark-as-read...) update the
// UI on the same tick as the click while the network request runs in the
// background. If the request fails, the exact pre-click state is restored and
// the failure is reported to the user.
//
// Two flavors live here:
//
//   runOptimistic           - for local useState-based screens. Snapshot ->
//                             apply -> commit; rollback + onError on failure.
//
//   snapshotQueries /
//   restoreQueries          - for TanStack Query caches: capture every cached
//                             entry under a key prefix so a mutation's
//                             onMutate/onError pair can patch optimistically
//                             and roll back.
// ============================================================================

import type { QueryClient } from "@tanstack/react-query"

export interface OptimisticAction<TSnapshot> {
  /**
   * Unique guard key per entity+action (e.g. `favorite:${id}`). While an
   * action with the same key is still in flight, new invocations are ignored,
   * so rapid double-clicks cannot stack conflicting requests and rollbacks.
   */
  lockKey?: string
  /** Capture the state BEFORE anything changes. Must be synchronous. */
  snapshot: () => TSnapshot
  /** Apply the intended change immediately. Must be synchronous. */
  apply: () => void
  /** The background request. Resolving keeps the change; rejecting rolls it back. */
  commit: () => Promise<unknown>
  /**
   * Restore the UI from the snapshot taken in `snapshot()`. Use functional
   * setState inside so edits made elsewhere meanwhile are preserved.
   */
  rollback: (snapshot: TSnapshot) => void
  /**
   * Optional reconciliation once the server responds - e.g. replace the local
   * guess with server truth to survive races or server-side normalization.
   */
  reconcile?: (data: unknown) => void
  /** Called after rollback with the typed error. Surface a message here. */
  onError?: (error: unknown) => void
}

const inFlight = new Set<string>()

/**
 * Run an action optimistically: snapshot -> instant UI change -> background
 * request -> reconcile on success or restore on failure.
 * Returns true when the action ran, false when suppressed because the same
 * lockKey was already in flight.
 */
export async function runOptimistic<TSnapshot>(
  action: OptimisticAction<TSnapshot>,
): Promise<boolean> {
  const { lockKey } = action
  if (lockKey) {
    if (inFlight.has(lockKey)) return false
    inFlight.add(lockKey)
  }

  const snapshot = action.snapshot()
  action.apply()

  try {
    const data = await action.commit()
    action.reconcile?.(data)
    return true
  } catch (error) {
    action.rollback(snapshot)
    action.onError?.(error)
    return false
  } finally {
    if (lockKey) inFlight.delete(lockKey)
  }
}

export interface QueryCacheSnapshot {
  queryKey: readonly unknown[]
  data: unknown
}

/** Capture every cached query whose key starts with `keyPrefix`. */
export function snapshotQueries(
  queryClient: QueryClient,
  keyPrefix: readonly unknown[],
): QueryCacheSnapshot[] {
  return queryClient
    .getQueryCache()
    .findAll({ queryKey: keyPrefix })
    .map((query) => ({ queryKey: query.queryKey, data: queryClient.getQueryData(query.queryKey) }))
}

/** Put every cache entry captured by {@link snapshotQueries} back exactly as it was. */
export function restoreQueries(
  queryClient: QueryClient,
  snapshots: QueryCacheSnapshot[] | undefined,
): void {
  if (!snapshots) return
  for (const snap of snapshots) {
    queryClient.setQueryData(snap.queryKey, snap.data)
  }
}
