import type { TmdbMovieListItem, TmdbSearchMovieListItem } from '../src/api/types';
import {
  mergeUniqueMovieListById,
  mergeUniqueSearchMovieListById,
} from '../src/utils/mergeUniqueMovieListById';

function item(id: number): TmdbMovieListItem {
  return {
    id,
    title: `T${String(id)}`,
    poster_path: null,
    backdrop_path: null,
    vote_average: 7,
    release_date: '2024-01-01',
    genre_ids: [],
  };
}

describe('mergeUniqueMovieListById', () => {
  it('appends only ids not already present', () => {
    const prev = [item(1), item(2)];
    const incoming = [item(2), item(3), item(1)];
    expect(mergeUniqueMovieListById(prev, incoming).map((m) => m.id)).toEqual([1, 2, 3]);
  });

  it('returns a copy when incoming is empty', () => {
    const prev = [item(1)];
    expect(mergeUniqueMovieListById(prev, [])).toEqual(prev);
  });
});

function searchItem(id: number): TmdbSearchMovieListItem {
  return {
    id,
    title: `S${String(id)}`,
    poster_path: null,
    backdrop_path: null,
    vote_average: 6,
    release_date: '2023-06-01',
  };
}

describe('mergeUniqueSearchMovieListById', () => {
  it('dedupes by id when appending search pages', () => {
    const prev = [searchItem(1)];
    const incoming = [searchItem(1), searchItem(2)];
    expect(mergeUniqueSearchMovieListById(prev, incoming).map((m) => m.id)).toEqual([1, 2]);
  });
});
