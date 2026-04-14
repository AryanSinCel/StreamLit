import type { WatchlistItem, WatchlistMediaFilter } from '../api/types';

export function filterWatchlistItems(
  items: readonly WatchlistItem[],
  filter: WatchlistMediaFilter,
): WatchlistItem[] {
  if (filter === 'all') {
    return items.slice();
  }
  return items.filter((item) => item.mediaType === filter);
}

/**
 * Anchor for `GET /movie/{id}/similar` (PSD-Watchlist §2): the **last** element of
 * `items` — same order as `addItem` appends in `watchlistStore`. Returns that
 * item’s `id` only when `mediaType === 'movie'` so the movie similar endpoint is
 * not called with a TV id.
 */
export function getWatchlistSimilarMovieAnchorId(
  items: readonly WatchlistItem[],
): number | null {
  if (items.length === 0) {
    return null;
  }
  const tail = items[items.length - 1];
  return tail.mediaType === 'movie' ? tail.id : null;
}
