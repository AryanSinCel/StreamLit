/** Shared types — extend as TMDB endpoints are implemented (feature PSDs). */

/**
 * Standard shape for data hooks (`useHome`, `useSearch`, `useMovieDetail`, …).
 * Re-exported from hooks via `../api/types` — single source of truth.
 */
export interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** TMDB movie row in list endpoints (trending, top_rated, discover, search). */
export interface TmdbMovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  /** Present on most list responses; optional for defensive parsing. */
  overview?: string | null;
}

/** Paginated list responses from TMDB (`trending`, `top_rated`, `discover`, `search`, …). */
export interface TmdbPagedMoviesResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovieListItem[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbGenresListResponse {
  genres: TmdbGenre[];
}

export interface TmdbMovieGenre {
  id: number;
  name: string;
}

/** `GET /movie/{id}` — detail payload used by `useMovieDetail`. */
export interface TmdbMovieDetail {
  id: number;
  title: string;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genres: TmdbMovieGenre[];
  runtime: number | null;
  overview: string | null;
}

/** Aggregated Home tab payload (trending + top rated + genres). */
export interface HomeData {
  trending: TmdbPagedMoviesResponse;
  topRated: TmdbPagedMoviesResponse;
  genres: TmdbGenre[];
}

/** PSD Home chip keys — order matches `HOME_CHIP_DEFINITIONS`. */
export type HomeChipKey =
  | 'all'
  | 'action'
  | 'drama'
  | 'comedy'
  | 'sci_fi'
  | 'horror'
  | 'documentary';

/** Chip label + TMDB list `name` to resolve id (null name = All). */
export interface HomeChipDefinition {
  key: HomeChipKey;
  label: string;
  tmdbGenreName: string | null;
}

/** Programme copy + TMDB genre name mapping (`Sci-Fi` → `Science Fiction`). */
export const HOME_CHIP_DEFINITIONS: readonly HomeChipDefinition[] = [
  { key: 'all', label: 'All', tmdbGenreName: null },
  { key: 'action', label: 'Action', tmdbGenreName: 'Action' },
  { key: 'drama', label: 'Drama', tmdbGenreName: 'Drama' },
  { key: 'comedy', label: 'Comedy', tmdbGenreName: 'Comedy' },
  { key: 'sci_fi', label: 'Sci-Fi', tmdbGenreName: 'Science Fiction' },
  { key: 'horror', label: 'Horror', tmdbGenreName: 'Horror' },
  { key: 'documentary', label: 'Documentary', tmdbGenreName: 'Documentary' },
] as const;

/** One horizontal row on Home: accumulated pages + pagination flags. */
export interface HomeFeedRowState {
  items: TmdbMovieListItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  /** Last successfully loaded TMDB page (0 before first success). */
  page: number;
  hasMore: boolean;
}

export function createInitialHomeFeedRowState(): HomeFeedRowState {
  return {
    items: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 0,
    hasMore: false,
  };
}

/** Resolved chip + TMDB id after `/genre/movie/list` (null id = All or missing name). */
export interface HomeChipResolved {
  key: HomeChipKey;
  label: string;
  genreId: number | null;
}

/**
 * `useHome` return shape: structured feeds + top-level `loading` / `error` / `refetch`
 * (not `UseQueryResult<T>` — see comment on `useHome`).
 */
export interface UseHomeResult {
  loading: boolean;
  error: string | null;
  refetch: () => void;
  /** First trending movie when present (PSD: hero = `results[0]`). */
  hero: TmdbMovieListItem | null;
  /** True until first trending request settles (success or error). */
  heroLoading: boolean;
  genres: TmdbGenre[];
  genresError: string | null;
  chips: readonly HomeChipResolved[];
  selectedChipKey: HomeChipKey;
  setSelectedChipKey: (key: HomeChipKey) => void;
  trending: HomeFeedRowState;
  topRated: HomeFeedRowState;
  genre: HomeFeedRowState;
  loadMoreTrending: () => void;
  loadMoreTopRated: () => void;
  loadMoreGenre: () => void;
}

/** Search tab: paginated movie list for the current query. */
export type SearchMoviesData = TmdbPagedMoviesResponse;

export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string;
  genreIds: number[];
  mediaType: 'movie' | 'tv';
}

/**
 * Normalized failure shape from `client` interceptors (hooks map `message` to UI).
 */
export interface NormalizedApiError {
  message: string;
  status?: number;
}

export class ApiError extends Error implements NormalizedApiError {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Common TMDB pagination query + response fields (stubs for future list endpoints). */
export interface PaginationParams {
  page?: number;
}

/** Query params for `GET /discover/movie`. Omit `with_genres` for no genre filter (e.g. “All” chip). */
export interface DiscoverMoviesParams extends PaginationParams {
  with_genres?: number;
}

export interface PageMeta {
  page: number;
  total_pages: number;
  total_results: number;
}

/** Minimal `/configuration` smoke response — expand when needed. */
export interface TmdbConfigurationImages {
  base_url?: string;
  secure_base_url?: string;
  poster_sizes?: string[];
  backdrop_sizes?: string[];
}

export interface TmdbConfigurationResponse {
  images?: TmdbConfigurationImages;
  change_keys?: string[];
}
