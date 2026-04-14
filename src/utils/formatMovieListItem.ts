import type { TmdbMovieListItem } from '../api/types';

/** Year + vote average for content row subtitles (genre names need a separate lookup). */
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
