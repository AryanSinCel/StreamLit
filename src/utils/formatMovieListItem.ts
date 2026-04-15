import type { TmdbGenre, TmdbMovieListItem } from '../api/types';

function firstGenreNameForMovie(
  item: TmdbMovieListItem,
  genres: readonly TmdbGenre[],
): string {
  const idToName = new Map<number, string>(genres.map((g) => [g.id, g.name]));
  const ids = item.genre_ids ?? [];
  for (const id of ids) {
    const name = idToName.get(id);
    if (name != null && name.trim().length > 0) {
      return name.trim();
    }
  }
  return '—';
}

/**
 * Home horizontal rails — `resources/home.html` metadata line (`Year • Genre`).
 */
export function formatHomeRailSubtitle(
  item: TmdbMovieListItem,
  genres: readonly TmdbGenre[],
): string {
  const year =
    item.release_date != null && item.release_date.length >= 4
      ? item.release_date.slice(0, 4)
      : '—';
  return `${year} · ${firstGenreNameForMovie(item, genres)}`;
}

/**
 * Search default featured line — `resources/search.html` (`Sci-Fi • 2024 • 2h 15m`; runtime omitted when unknown).
 */
export function formatSearchFeaturedMeta(
  item: TmdbMovieListItem,
  genres: readonly TmdbGenre[],
): string {
  const genre = firstGenreNameForMovie(item, genres);
  const year =
    item.release_date != null && item.release_date.length >= 4
      ? item.release_date.slice(0, 4)
      : '—';
  return `${genre} • ${year}`;
}

/** Search default trending mini cards — subtitle is primary genre only (`search.html`). */
export function formatSearchTrendingGenreOnly(
  item: TmdbMovieListItem,
  genres: readonly TmdbGenre[],
): string {
  return firstGenreNameForMovie(item, genres);
}

/** Year + vote average for grids / See All / Search-style subtitles. */
export function formatListMovieSubtitle(item: TmdbMovieListItem): string {
  const year =
    item.release_date != null && item.release_date.length >= 4
      ? item.release_date.slice(0, 4)
      : '—';
  const rating =
    typeof item.vote_average === 'number' &&
    !Number.isNaN(item.vote_average) &&
    Number.isFinite(item.vote_average)
      ? item.vote_average.toFixed(1)
      : '—';
  return `${year} · ${rating}`;
}
