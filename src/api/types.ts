/** Shared types — extend as TMDB endpoints are implemented (feature PSDs). */

/**
 * Standard shape for a single TMDB section (`useWatchlist.similar`, …).
 * `useMovieDetail` exposes **three** of these on `UseMovieDetailResult` (PSD-Detail §2.2).
 * `useHome` / `useSearch` use other composite types.
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

/** Paginated list responses from TMDB (`trending`, `top_rated`, `discover`, …). */
export interface TmdbPagedMoviesResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovieListItem[];
}

/**
 * One row from `GET /search/movie` `results[]`.
 * TMDB may omit or null optional media/metadata fields; callers should not assume posters or dates exist.
 */
export interface TmdbSearchMovieListItem {
  id: number;
  title: string | null;
  original_title?: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count?: number;
  release_date: string | null;
  /** TMDB normally includes this; treat a missing key as `[]` when reading raw JSON. */
  genre_ids?: number[];
  overview?: string | null;
  popularity?: number;
}

/** Paginated payload from `GET /search/movie` (PSD Search results + optional `page`). */
export interface TmdbPagedSearchMoviesResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbSearchMovieListItem[];
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
  /** TMDB normally includes this; treat missing as empty string in UI if needed. */
  name: string;
}

/**
 * `GET /movie/{movie_id}` — movie detail (PSD-Detail §2.1 “Details”, task **D1**).
 * Mirrors TMDB v3; several fields are nullable or may be empty — Detail UI must follow PSD-Detail §3.
 */
export interface TmdbMovieDetail {
  id: number;
  title: string;
  original_title?: string | null;
  /** Key art path; `null` when TMDB has no poster (PSD-Detail §3 — placeholder in UI). */
  poster_path: string | null;
  /** Hero/backdrop path; `null` when absent (PSD-Detail §3). */
  backdrop_path: string | null;
  /**
   * Weighted score; **`0`** or very low values → omit rating chip per PSD-Detail §3.
   * TMDB may omit the key on malformed payloads — normalize in hooks if needed.
   */
  vote_average: number;
  vote_count?: number;
  /** ISO `YYYY-MM-DD`; `null` or `""` when unknown — do not assume a display year exists. */
  release_date: string | null;
  /** Full genre objects (list endpoints use `genre_ids` instead). Often non-empty; may be `[]`. */
  genres: TmdbMovieGenre[];
  /** Runtime in minutes; `null` or **`0`** → omit runtime chip (PSD-Detail §3). */
  runtime: number | null;
  /** Synopsis; `null` or blank → handle empty copy in UI. */
  overview: string | null;
  tagline?: string | null;
}

/**
 * One billing row in `GET /movie/{movie_id}/credits` `cast[]` (PSD-Detail §2.1 “Cast”).
 * TMDB includes `order` for cast sort; `profile_path` is often `null` (§3 — avatar placeholder).
 */
export interface TmdbMovieCastCredit {
  id: number;
  name: string;
  /** Role as credited; may be empty string. */
  character: string;
  profile_path: string | null;
  /** Lower values are more top-billed; TMDB may omit on unusual rows. */
  order?: number;
  credit_id?: string;
  cast_id?: number;
}

/**
 * `GET /movie/{movie_id}/credits` — cast (and crew) for Detail (PSD-Detail §2.1 “Cast”).
 * `cast` may be empty; `crew` exists on TMDB but is omitted here until the app consumes it (D1 scope).
 */
export interface TmdbMovieCreditsResponse {
  id: number;
  cast: TmdbMovieCastCredit[];
}

/**
 * `useMovieDetail(movieId)` — three parallel TMDB slices (PSD-Detail §2.1–2.2, task **D2**).
 * Each `refetch` retries **only** that section’s `GET` via `movies.ts`.
 */
export interface UseMovieDetailResult {
  details: UseQueryResult<TmdbMovieDetail>;
  credits: UseQueryResult<TmdbMovieCreditsResponse>;
  similar: UseQueryResult<TmdbPagedMoviesResponse>;
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

/** Genre chips only — order for stacked “All” rails on Home (PSD: one strip per genre). */
export type HomeGenreRailKey = Exclude<HomeChipKey, 'all'>;

export const HOME_GENRE_RAIL_KEYS: readonly HomeGenreRailKey[] = [
  'action',
  'drama',
  'comedy',
  'sci_fi',
  'horror',
  'documentary',
];

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
  /** Single discover row when a specific genre chip is selected (not `all`). */
  genre: HomeFeedRowState;
  /**
   * When chip is `all`, Home shows one horizontal rail per genre (`HOME_GENRE_RAIL_KEYS`).
   * Unused rows stay idle when a specific chip is selected.
   */
  genreRails: Record<HomeGenreRailKey, HomeFeedRowState>;
  loadMoreTrending: () => void;
  loadMoreTopRated: () => void;
  loadMoreGenre: () => void;
  loadMoreGenreRail: (key: HomeGenreRailKey) => void;
}

/** Search tab: paginated movie list for the current query (`GET /search/movie`). */
export type SearchMoviesData = TmdbPagedSearchMoviesResponse;

/** Search tab: idle (empty debounced query) vs active TMDB results session. */
export type SearchScreenMode = 'default' | 'results';

/** Controlled Search input — `setQuery` enables `applyGenreChip` to sync the text field. */
export interface UseSearchInput {
  query: string;
  setQuery?: (value: string) => void;
}

/**
 * `useSearch` composite return (PSD-Search §2.2, §7 S3).
 * Search fetching is debounced; trending loads for default mode; recents hydrate from AsyncStorage.
 */
export interface UseSearchResult {
  /** `default` when debounced query is empty; `results` when a non-empty debounced query is active. */
  mode: SearchScreenMode;
  /** Query string driving TMDB search after the 400ms debounce (trim + collapsed whitespace). */
  debouncedQuery: string;
  /** Last successful `GET /search/movie` payload for the current debounced query, or null. */
  data: TmdbPagedSearchMoviesResponse | null;
  results: TmdbSearchMovieListItem[];
  totalResults: number;
  /** True while a debounced or genre-immediate search request is in flight. */
  loading: boolean;
  error: string | null;
  /** Re-runs the current debounced search (e.g. after error). */
  refetch: () => void;
  /** `GET /trending/movie/week` page 1 for the default-state trending block. */
  trending: TmdbPagedMoviesResponse | null;
  trendingLoading: boolean;
  trendingError: string | null;
  refetchTrending: () => void;
  recentSearches: readonly string[];
  refreshRecentSearches: () => Promise<void>;
  clearRecentSearches: () => Promise<void>;
  /** Last query that completed a successful search (for “N results for ‘…’” copy). */
  lastSuccessfulQuery: string | null;
  /**
   * Genre chip path: updates controlled `query` when `setQuery` is provided, skips debounce,
   * and runs `GET /search/movie` immediately for the label text.
   */
  applyGenreChip: (label: string) => void;
  /** `/genre/movie/list` — resolves `genre_ids` on default trending / featured copy (Search tab). */
  movieGenres: readonly TmdbGenre[];
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

/** Watchlist tab chips — client-side only; maps to `WatchlistItem.mediaType` (`resources/watchlist.html`). */
export type WatchlistMediaFilter = 'all' | 'movie' | 'tv';

/**
 * Watchlist screen hook (PSD-Watchlist §7 W1): local list + filter, TMDB similar
 * for the tail movie anchor, store hydration gate.
 */
export interface UseWatchlistResult {
  hydrated: boolean;
  count: number;
  /** Full persisted list (same order as the store). */
  items: WatchlistItem[];
  filter: WatchlistMediaFilter;
  setFilter: (filter: WatchlistMediaFilter) => void;
  filteredItems: WatchlistItem[];
  /** `GET /movie/{id}/similar` for the anchor id; idle when no anchor. */
  similar: UseQueryResult<TmdbPagedMoviesResponse>;
  /**
   * `GET /trending/movie/week` page 1 for empty-state “Popular recommendations” (PSD-Watchlist §5).
   * No request while the watchlist has items or before hydration.
   */
  popularRecommendations: UseQueryResult<TmdbPagedMoviesResponse>;
  /**
   * `GET /genre/movie/list` — resolves **`WatchlistItem.genreIds`** on the populated grid
   * (`resources/watchlist.html`). Empty until a successful fetch while the list has items.
   */
  movieGenres: readonly TmdbGenre[];
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
