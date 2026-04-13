/** Shared types — extend as TMDB endpoints are implemented (feature PSDs). */

export interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

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
