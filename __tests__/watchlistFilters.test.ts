import type { WatchlistItem } from '../src/api/types';
import {
  filterWatchlistItems,
  getWatchlistSimilarMovieAnchorId,
} from '../src/utils/watchlistFilters';

const movie = (id: number): WatchlistItem => ({
  id,
  title: `M${id}`,
  posterPath: null,
  voteAverage: 7,
  releaseDate: '2020-01-01',
  genreIds: [],
  mediaType: 'movie',
});

const tv = (id: number): WatchlistItem => ({
  id,
  title: `T${id}`,
  posterPath: null,
  voteAverage: 8,
  releaseDate: '2021-01-01',
  genreIds: [],
  mediaType: 'tv',
});

describe('filterWatchlistItems', () => {
  it('returns all items in store order for `all`', () => {
    const items = [movie(1), tv(2), movie(3)];
    expect(filterWatchlistItems(items, 'all')).toEqual(items);
    expect(filterWatchlistItems(items, 'all')).not.toBe(items);
  });

  it('filters movies only', () => {
    const items = [movie(1), tv(2), movie(3)];
    expect(filterWatchlistItems(items, 'movie')).toEqual([movie(1), movie(3)]);
  });

  it('filters series only', () => {
    const items = [movie(1), tv(2), movie(3)];
    expect(filterWatchlistItems(items, 'tv')).toEqual([tv(2)]);
  });
});

describe('getWatchlistSimilarMovieAnchorId', () => {
  it('returns null for empty list', () => {
    expect(getWatchlistSimilarMovieAnchorId([])).toBeNull();
  });

  it('uses the last item when it is a movie', () => {
    const items = [movie(1), tv(2), movie(99)];
    expect(getWatchlistSimilarMovieAnchorId(items)).toBe(99);
  });

  it('returns null when the last item is tv (movie similar endpoint)', () => {
    const items = [movie(1), tv(2)];
    expect(getWatchlistSimilarMovieAnchorId(items)).toBeNull();
  });
});
