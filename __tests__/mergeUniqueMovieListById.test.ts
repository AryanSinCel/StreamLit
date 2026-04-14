import type { TmdbMovieListItem } from '../src/api/types';
import { mergeUniqueMovieListById } from '../src/utils/mergeUniqueMovieListById';

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
