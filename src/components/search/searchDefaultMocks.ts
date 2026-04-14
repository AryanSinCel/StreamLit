/**
 * S4a static fixtures — replaced by `useSearch` + TMDB in S4b / S5.
 */

export const SEARCH_INPUT_PLACEHOLDER =
  'Search movies, actors, directors...' as const;

export const MOCK_GENRE_LABELS = [
  'Action',
  'Comedy',
  'Sci-Fi',
  'Drama',
  'Horror',
  'Documentary',
] as const;

export const MOCK_RECENT_SEARCHES = [
  'Interstellar Journey',
  'The Dark Knight',
  'Quentin Tarantino',
] as const;

export const MOCK_TRENDING_FEATURED = {
  title: 'Neon Pulse',
  metadataLine: 'Sci-Fi • 2024 • 2h 15m',
} as const;

export type MockTrendingGridItem = {
  id: string;
  title: string;
  genreLabel: string;
  ratingLabel: string;
};

export const MOCK_TRENDING_GRID: readonly MockTrendingGridItem[] = [
  { id: 'm1', title: 'Vintage Reel', genreLabel: 'Documentary', ratingLabel: '4.8' },
  { id: 'm2', title: 'Silent Rows', genreLabel: 'Thriller', ratingLabel: '4.5' },
  { id: 'm3', title: 'Golden Ticket', genreLabel: 'Romance', ratingLabel: '4.2' },
];
