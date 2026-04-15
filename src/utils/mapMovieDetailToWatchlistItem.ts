import type { TmdbMovieDetail, WatchlistItem } from '../api/types';

/**
 * Maps TMDB movie detail (from `useMovieDetail`) into persisted **`WatchlistItem`** shape.
 * **`canonicalId`** is the navigation **`movieId`** so list membership matches route params.
 */
export function mapMovieDetailToWatchlistItem(
  detail: TmdbMovieDetail,
  canonicalId: number,
): WatchlistItem {
  return {
    id: canonicalId,
    title: detail.title,
    posterPath: detail.poster_path,
    voteAverage: detail.vote_average,
    releaseDate: detail.release_date ?? '',
    genreIds: detail.genres.map((g) => g.id),
    mediaType: 'movie',
  };
}
