import type { TmdbGenre, TmdbMovieListItem, WatchlistItem } from '../api/types';

function watchlistGridGenreLine(item: WatchlistItem, genres: readonly TmdbGenre[]): string {
  const idToName = new Map(genres.map((g) => [g.id, g.name.trim()]));
  const names: string[] = [];
  for (const id of item.genreIds ?? []) {
    const n = idToName.get(id);
    if (n != null && n.length > 0) {
      names.push(n);
    }
    if (names.length >= 2) {
      break;
    }
  }
  if (names.length === 0) {
    return item.mediaType === 'movie' ? 'Movie' : 'Series';
  }
  return names.join(' / ');
}

/** Year + genre line for Stitch watchlist card meta row (dot separator in UI). */
export function formatWatchlistGridMetaParts(
  item: WatchlistItem,
  genres: readonly TmdbGenre[],
): { year: string; genreLine: string } {
  const year = item.releaseDate.length >= 4 ? item.releaseDate.slice(0, 4) : '—';
  return { year, genreLine: watchlistGridGenreLine(item, genres) };
}

/**
 * Watchlist grid metadata — `resources/watchlist.html` (`Year • Sci-Fi / Action`).
 */
export function formatWatchlistGridSubtitle(item: WatchlistItem, genres: readonly TmdbGenre[]): string {
  const { year, genreLine } = formatWatchlistGridMetaParts(item, genres);
  return `${year} · ${genreLine}`;
}

/** “Because you saved …” rail — uppercase genre line (`resources/watchlist.html`). */
export function formatWatchlistSimilarRailGenreLine(
  item: TmdbMovieListItem,
  genres: readonly TmdbGenre[],
): string {
  const idToName = new Map(genres.map((g) => [g.id, g.name.trim()]));
  const names: string[] = [];
  for (const id of item.genre_ids ?? []) {
    const n = idToName.get(id);
    if (n != null && n.length > 0) {
      names.push(n.toUpperCase());
    }
    if (names.length >= 2) {
      break;
    }
  }
  return names.length > 0 ? names.join(' / ') : '—';
}
