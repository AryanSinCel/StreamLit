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
 * Anchor for `GET /movie/{id}/similar` (PSD-Watchlist §2): the **first** movie in
 * store order (**newest-first** after `watchlistStore` prepend + v0→v1 migrate). Skips
 * leading TV ids so the movie similar endpoint is never called with a TV id.
 */
export function getWatchlistSimilarMovieAnchorId(
  items: readonly WatchlistItem[],
): number | null {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item != null && item.mediaType === 'movie') {
      return item.id;
    }
  }
  return null;
}
