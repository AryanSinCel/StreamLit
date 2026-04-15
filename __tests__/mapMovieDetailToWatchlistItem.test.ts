/**
 * @format
 */

import type { TmdbMovieDetail } from '../src/api/types';
import { mapMovieDetailToWatchlistItem } from '../src/utils/mapMovieDetailToWatchlistItem';

const baseDetail: TmdbMovieDetail = {
  id: 99,
  title: 'Sample',
  poster_path: '/p.jpg',
  backdrop_path: null,
  vote_average: 7.5,
  release_date: '2024-06-01',
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  runtime: 120,
  overview: 'Synopsis',
};

describe('mapMovieDetailToWatchlistItem', () => {
  it('maps TMDB fields to WatchlistItem with route id', () => {
    const item = mapMovieDetailToWatchlistItem(baseDetail, 42);
    expect(item).toEqual({
      id: 42,
      title: 'Sample',
      posterPath: '/p.jpg',
      voteAverage: 7.5,
      releaseDate: '2024-06-01',
      genreIds: [28, 12],
      mediaType: 'movie',
    });
  });

  it('uses empty string when release_date is null', () => {
    const item = mapMovieDetailToWatchlistItem(
      { ...baseDetail, release_date: null },
      1,
    );
    expect(item.releaseDate).toBe('');
  });
});
