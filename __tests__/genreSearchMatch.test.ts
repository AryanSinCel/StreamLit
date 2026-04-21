import { genreIdForDebouncedQuery } from '../src/utils/genreSearchMatch';

describe('genreIdForDebouncedQuery', () => {
  it('returns TMDB genre id when term matches genre name case-insensitively', () => {
    const genres = [
      { id: 12, name: 'Adventure' },
      { id: 28, name: 'Action' },
    ];
    expect(genreIdForDebouncedQuery('Action', genres)).toBe(28);
    expect(genreIdForDebouncedQuery('action', genres)).toBe(28);
  });

  it('returns null when term does not match any genre', () => {
    expect(genreIdForDebouncedQuery('Batman', [{ id: 28, name: 'Action' }])).toBeNull();
  });

  it('returns null for empty term or empty genres', () => {
    expect(genreIdForDebouncedQuery('', [{ id: 1, name: 'X' }])).toBeNull();
    expect(genreIdForDebouncedQuery('Action', [])).toBeNull();
  });
});
