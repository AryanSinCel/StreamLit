import type { TmdbMovieListItem, TmdbSearchMovieListItem } from '../api/types';

/** Append list items, skipping any `id` already present (guards duplicate page responses). */
export function mergeUniqueMovieListById(
  prev: readonly TmdbMovieListItem[],
  incoming: readonly TmdbMovieListItem[],
): TmdbMovieListItem[] {
  const seen = new Set(prev.map((m) => m.id));
  const out = [...prev];
  for (const m of incoming) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      out.push(m);
    }
  }
  return out;
}

/** Append search rows, skipping duplicate `id` (paginated `GET /search/movie`). */
export function mergeUniqueSearchMovieListById(
  prev: readonly TmdbSearchMovieListItem[],
  incoming: readonly TmdbSearchMovieListItem[],
): TmdbSearchMovieListItem[] {
  const seen = new Set(prev.map((m) => m.id));
  const out = [...prev];
  for (const m of incoming) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      out.push(m);
    }
  }
  return out;
}
