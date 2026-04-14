/**
 * TMDB endpoints — import only `client` from `./client` (no raw axios).
 */

import { client } from './client';
import type {
  DiscoverMoviesParams,
  HomeData,
  PaginationParams,
  TmdbConfigurationResponse,
  TmdbGenresListResponse,
  TmdbMovieDetail,
  TmdbPagedMoviesResponse,
  TmdbPagedSearchMoviesResponse,
} from './types';

/** Single smoke GET — proves Bearer auth + interceptors; not a feature endpoint. */
export async function getConfigurationSmoke(): Promise<TmdbConfigurationResponse> {
  const { data } = await client.get<TmdbConfigurationResponse>('/configuration');
  return data;
}

type RequestOpts = {
  signal?: AbortSignal;
};

/**
 * `GET /trending/movie/week` — shared by Home (`getHomeData`) and Search default trending block (same TMDB feed; do not duplicate).
 */
export async function getTrendingMoviesWeek(
  params?: PaginationParams & RequestOpts,
): Promise<TmdbPagedMoviesResponse> {
  const { data } = await client.get<TmdbPagedMoviesResponse>('/trending/movie/week', {
    params: { page: params?.page ?? 1 },
    signal: params?.signal,
  });
  return data;
}

export async function getTopRatedMovies(
  params?: PaginationParams & RequestOpts,
): Promise<TmdbPagedMoviesResponse> {
  const { data } = await client.get<TmdbPagedMoviesResponse>('/movie/top_rated', {
    params: { page: params?.page ?? 1 },
    signal: params?.signal,
  });
  return data;
}

export async function getMovieGenres(
  opts?: RequestOpts,
): Promise<TmdbGenresListResponse> {
  const { data } = await client.get<TmdbGenresListResponse>('/genre/movie/list', {
    signal: opts?.signal,
  });
  return data;
}

export async function getDiscoverMovies(
  params?: DiscoverMoviesParams & RequestOpts,
): Promise<TmdbPagedMoviesResponse> {
  const page = params?.page ?? 1;
  const withGenres = params?.with_genres;
  const queryParams: { page: number; with_genres?: number } = { page };
  if (withGenres !== undefined) {
    queryParams.with_genres = withGenres;
  }
  const { data } = await client.get<TmdbPagedMoviesResponse>('/discover/movie', {
    params: queryParams,
    signal: params?.signal,
  });
  return data;
}

/** Parallel Home bundle — one place for `movies.ts` orchestration of home feeds. */
export async function getHomeData(opts?: RequestOpts): Promise<HomeData> {
  const signal = opts?.signal;
  const [trending, topRated, genresRes] = await Promise.all([
    getTrendingMoviesWeek({ page: 1, signal }),
    getTopRatedMovies({ page: 1, signal }),
    getMovieGenres({ signal }),
  ]);
  return {
    trending,
    topRated,
    genres: genresRes.genres,
  };
}

/**
 * `GET /search/movie` — TMDB movie search by text.
 * @param query — required `query` query param
 * @param params.page — optional TMDB page (defaults to `1`); `signal` for cancellation
 */
export async function searchMovies(
  query: string,
  params?: PaginationParams & RequestOpts,
): Promise<TmdbPagedSearchMoviesResponse> {
  const { data } = await client.get<TmdbPagedSearchMoviesResponse>('/search/movie', {
    params: {
      query,
      page: params?.page ?? 1,
    },
    signal: params?.signal,
  });
  return data;
}

export async function getMovieDetail(
  movieId: number,
  opts?: RequestOpts,
): Promise<TmdbMovieDetail> {
  const { data } = await client.get<TmdbMovieDetail>(`/movie/${movieId}`, {
    signal: opts?.signal,
  });
  return data;
}
