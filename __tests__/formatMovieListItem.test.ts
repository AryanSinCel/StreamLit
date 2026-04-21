import type { TmdbGenre, TmdbMovieListItem } from '../src/api/types';
import {
  formatHomeRailSubtitle,
  formatListMovieSubtitle,
  formatSearchFeaturedMeta,
  formatSearchTrendingGenreOnly,
} from '../src/utils/formatMovieListItem';

const sampleGenres: readonly TmdbGenre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
];

const sampleMovie: TmdbMovieListItem = {
  id: 1,
  title: 'Test',
  poster_path: null,
  backdrop_path: null,
  vote_average: 7.2,
  release_date: '2024-03-01',
  genre_ids: [12, 28],
};

describe('formatHomeRailSubtitle', () => {
  it('uses first resolvable genre id in TMDB order', () => {
    expect(formatHomeRailSubtitle(sampleMovie, sampleGenres)).toBe('2024 · Adventure');
  });

  it('falls back to em dash when no genre matches', () => {
    const movie: TmdbMovieListItem = {
      ...sampleMovie,
      genre_ids: [999],
    };
    expect(formatHomeRailSubtitle(movie, sampleGenres)).toBe('2024 · —');
  });

  it('handles missing release date', () => {
    const movie: TmdbMovieListItem = {
      ...sampleMovie,
      release_date: '',
      genre_ids: [28],
    };
    expect(formatHomeRailSubtitle(movie, sampleGenres)).toBe('— · Action');
  });
});

describe('formatListMovieSubtitle', () => {
  it('returns release year only (rating on poster badge)', () => {
    expect(formatListMovieSubtitle(sampleMovie)).toBe('2024');
  });

  it('uses em dash when release date is missing', () => {
    expect(formatListMovieSubtitle({ ...sampleMovie, release_date: '' })).toBe('—');
  });
});

describe('formatSearchFeaturedMeta', () => {
  it('orders genre before year with bullet separator', () => {
    expect(formatSearchFeaturedMeta(sampleMovie, sampleGenres)).toBe('Adventure • 2024');
  });

  it('appends compact runtime when minutes are valid', () => {
    expect(formatSearchFeaturedMeta(sampleMovie, sampleGenres, 135)).toBe('Adventure • 2024 • 2h 15m');
    expect(formatSearchFeaturedMeta(sampleMovie, sampleGenres, 120)).toBe('Adventure • 2024 • 2h');
  });

  it('omits runtime when null, zero, or invalid', () => {
    expect(formatSearchFeaturedMeta(sampleMovie, sampleGenres, null)).toBe('Adventure • 2024');
    expect(formatSearchFeaturedMeta(sampleMovie, sampleGenres, 0)).toBe('Adventure • 2024');
  });
});

describe('formatSearchTrendingGenreOnly', () => {
  it('returns a single primary genre label', () => {
    expect(formatSearchTrendingGenreOnly(sampleMovie, sampleGenres)).toBe('Adventure');
  });
});
