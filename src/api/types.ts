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
}

export interface TmdbPagedMoviesResponse {
  page: number;
  total_pages: number;
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

export interface PageMeta {
  page: number;
  total_pages: number;
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
