import type { TmdbGenre, TmdbMovieListItem, WatchlistItem } from '../api/types';

/**
 * Watchlist grid metadata — `resources/watchlist.html` (`Year • Sci-Fi / Action`).
 */
export function formatWatchlistGridSubtitle(item: WatchlistItem, genres: readonly TmdbGenre[]): string {
  const year = item.releaseDate.length >= 4 ? item.releaseDate.slice(0, 4) : '—';
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
    const kind = item.mediaType === 'movie' ? 'Movie' : 'Series';
    return `${year} · ${kind}`;
  }
  return `${year} · ${names.join(' / ')}`;
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
