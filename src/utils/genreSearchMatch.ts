import type { TmdbGenre } from '../api/types';

/** Same trimming / whitespace collapse as `normalizeSearchTerm` in `recentSearches.ts` (kept local so tests need no AsyncStorage). */
function collapseSearchWhitespace(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

/**
 * When the debounced search string matches a TMDB movie genre name (case-insensitive), return that genre’s id
 * so the Search tab can call **`GET /discover/movie`** with `with_genres` instead of title search.
 */
export function genreIdForDebouncedQuery(term: string, genres: readonly TmdbGenre[]): number | null {
  if (term.length === 0 || genres.length === 0) {
    return null;
  }
  const needle = collapseSearchWhitespace(term).toLowerCase();
  for (const g of genres) {
    if (collapseSearchWhitespace(g.name).toLowerCase() === needle) {
      return g.id;
    }
  }
  return null;
}
