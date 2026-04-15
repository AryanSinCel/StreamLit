import type { TmdbGenre, TmdbMovieListItem, WatchlistItem } from '../src/api/types';
import {
  formatWatchlistGridSubtitle,
  formatWatchlistSimilarRailGenreLine,
} from '../src/utils/formatWatchlistGridSubtitle';

const genres: readonly TmdbGenre[] = [
  { id: 878, name: 'Science Fiction' },
  { id: 28, name: 'Action' },
];

const movieItem: WatchlistItem = {
  id: 1,
  title: 'Test',
  posterPath: null,
  voteAverage: 8,
  releaseDate: '2024-03-01',
  genreIds: [878, 28],
  mediaType: 'movie',
};

describe('formatWatchlistGridSubtitle', () => {
  it('joins year and up to two genre names', () => {
    expect(formatWatchlistGridSubtitle(movieItem, genres)).toBe('2024 · Science Fiction / Action');
  });

  it('falls back to media kind when no genre match', () => {
    const item: WatchlistItem = { ...movieItem, genreIds: [99999] };
    expect(formatWatchlistGridSubtitle(item, genres)).toBe('2024 · Movie');
  });
});

describe('formatWatchlistSimilarRailGenreLine', () => {
  it('uppercases genre names for the similar rail', () => {
    const row: TmdbMovieListItem = {
      id: 2,
      title: 'Chrome Rebels',
      poster_path: null,
      backdrop_path: null,
      vote_average: 7,
      release_date: '2023-01-01',
      genre_ids: [878, 28],
    };
    expect(formatWatchlistSimilarRailGenreLine(row, genres)).toBe('SCIENCE FICTION / ACTION');
  });
});
