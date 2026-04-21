/**
 * Search tab orchestration (PSD-Search §1–2.2, §6–7): debounced TMDB search, abortable requests,
 * default-mode trending, recent searches persistence. Screens stay thin — no TMDB calls here beyond `movies.ts`.
 *
 * §6 quality bar (hook-owned): **400ms** debounce (`SEARCH_DEBOUNCE_MS`); **AbortController** per search;
 * recents via `addRecentSearch` only after a **completed** search; **genre chip** path bypasses debounce
 * (`genreBypassDebounceRef` + immediate `debouncedQuery` update). When the debounced string matches a
 * TMDB genre name, **`GET /discover/movie`** (`with_genres`) replaces title **`GET /search/movie`**.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DISCOVER_SORT_POPULARITY,
  getDiscoverMovies,
  getMovieDetail,
  getMovieGenres,
  getTrendingMoviesWeek,
  searchMovies,
} from '../api/movies';
import type {
  SearchTabSnapshot,
  TmdbGenre,
  TmdbMovieListItem,
  TmdbPagedMoviesResponse,
  TmdbPagedSearchMoviesResponse,
  TmdbSearchMovieListItem,
  UseQueryResult,
  UseSearchInput,
} from '../api/types';
import {
  addRecentSearch,
  clearRecentSearches as clearRecentSearchesStorage,
  getRecentSearches,
  normalizeSearchTerm,
} from '../utils/recentSearches';
import { genreIdForDebouncedQuery } from '../utils/genreSearchMatch';
import { mergeUniqueSearchMovieListById } from '../utils/mergeUniqueMovieListById';
import { isLikelyCanceledRequest, mapUnknownError } from '../utils/mapUnknownError';

const SEARCH_DEBOUNCE_MS = 400;

function mapDiscoverRowToSearchRow(row: TmdbMovieListItem): TmdbSearchMovieListItem {
  return {
    id: row.id,
    title: row.title,
    original_title: row.title,
    poster_path: row.poster_path,
    backdrop_path: row.backdrop_path,
    vote_average: row.vote_average,
    release_date: row.release_date.length > 0 ? row.release_date : null,
    genre_ids: row.genre_ids,
  };
}

function discoverPageToSearchPage(res: TmdbPagedMoviesResponse): TmdbPagedSearchMoviesResponse {
  return {
    page: res.page,
    total_pages: res.total_pages,
    total_results: res.total_results,
    results: res.results.map(mapDiscoverRowToSearchRow),
  };
}

export function useSearch({ query, setQuery }: UseSearchInput): UseQueryResult<SearchTabSnapshot> {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const genreBypassDebounceRef = useRef(false);
  const debouncedQueryRef = useRef('');
  const searchAbortRef = useRef<AbortController | null>(null);
  /** Last committed TMDB search `page` — drives `loadMore` next page. */
  const searchPageRef = useRef(0);
  /** Bumped when the debounced query session changes — invalidates in-flight `loadMore`. */
  const searchSessionGenRef = useRef(0);

  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [data, setData] = useState<TmdbPagedSearchMoviesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRetryKey, setSearchRetryKey] = useState(0);
  const [lastSuccessfulQuery, setLastSuccessfulQuery] = useState<string | null>(null);

  const [trending, setTrending] = useState<TmdbPagedMoviesResponse | null>(null);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [trendingReloadKey, setTrendingReloadKey] = useState(0);
  const [featuredRuntimeMinutes, setFeaturedRuntimeMinutes] = useState<number | null>(null);
  const featuredRuntimeFetchSeqRef = useRef(0);

  const [recentSearches, setRecentSearches] = useState<readonly string[]>([]);
  const [movieGenres, setMovieGenres] = useState<readonly TmdbGenre[]>([]);
  const movieGenresRef = useRef<readonly TmdbGenre[]>([]);
  const hasSearchTrendingSettledRef = useRef(false);

  debouncedQueryRef.current = debouncedQuery;
  movieGenresRef.current = movieGenres;

  /** Genre list for Search default trending (`genre_ids` → labels). */
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        const res = await getMovieGenres({ signal: controller.signal });
        if (!cancelled) {
          setMovieGenres(res.genres);
        }
      } catch {
        if (!cancelled) {
          setMovieGenres([]);
        }
      }
    })().catch(() => {
      /* non-fatal for Search UI */
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!trendingLoading) {
      hasSearchTrendingSettledRef.current = true;
    }
  }, [trendingLoading]);

  /** 400ms trailing debounce from controlled `query` → `debouncedQuery`. */
  useEffect(() => {
    if (genreBypassDebounceRef.current) {
      genreBypassDebounceRef.current = false;
      return;
    }
    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      setDebouncedQuery(normalizeSearchTerm(query));
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [query]);

  /** Default-mode trending (page 1). */
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      setTrendingLoading(true);
      setTrendingError(null);
      try {
        const res = await getTrendingMoviesWeek({
          page: 1,
          signal: controller.signal,
        });
        if (!cancelled) {
          setTrending(res);
        }
      } catch (e) {
        if (cancelled || isLikelyCanceledRequest(e)) {
          return;
        }
        setTrending(null);
        setTrendingError(mapUnknownError(e));
      } finally {
        if (!cancelled) {
          setTrendingLoading(false);
        }
      }
    })().catch(() => {
      /* surfaced via trendingError */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [trendingReloadKey]);

  /** First trending row has no `runtime`; fetch detail for featured meta (`Genre • Year • 2h 15m`). */
  useEffect(() => {
    const first = trending?.results[0];
    if (first == null) {
      setFeaturedRuntimeMinutes(null);
      return;
    }
    const movieId = first.id;
    featuredRuntimeFetchSeqRef.current += 1;
    const seq = featuredRuntimeFetchSeqRef.current;
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const detail = await getMovieDetail(movieId, { signal: controller.signal });
        if (cancelled || controller.signal.aborted || seq !== featuredRuntimeFetchSeqRef.current) {
          return;
        }
        setFeaturedRuntimeMinutes(detail.runtime);
      } catch {
        if (cancelled || seq !== featuredRuntimeFetchSeqRef.current) {
          return;
        }
        setFeaturedRuntimeMinutes(null);
      }
    })().catch(() => {
      if (!cancelled && seq === featuredRuntimeFetchSeqRef.current) {
        setFeaturedRuntimeMinutes(null);
      }
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [trending, trendingReloadKey]);

  /** Debounced / retried movie search + completed-search recents. */
  useEffect(() => {
    const term = debouncedQuery;
    if (term.length === 0) {
      searchAbortRef.current?.abort();
      searchAbortRef.current = null;
      searchSessionGenRef.current += 1;
      searchPageRef.current = 0;
      setData(null);
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);
      setError(null);
      setLastSuccessfulQuery(null);
      return;
    }

    searchSessionGenRef.current += 1;
    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    const termAtStart = term;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadingMore(false);
      setError(null);
      setData(null);
      setHasMore(false);
      searchPageRef.current = 0;
      try {
        const genreId = genreIdForDebouncedQuery(termAtStart, movieGenres);
        const resultPage =
          genreId != null
            ? discoverPageToSearchPage(
                await getDiscoverMovies({
                  page: 1,
                  signal: controller.signal,
                  sort_by: DISCOVER_SORT_POPULARITY,
                  with_genres: genreId,
                }),
              )
            : await searchMovies(termAtStart, {
                page: 1,
                signal: controller.signal,
              });
        if (cancelled || controller.signal.aborted) {
          return;
        }
        if (debouncedQueryRef.current !== termAtStart) {
          return;
        }
        setData(resultPage);
        searchPageRef.current = resultPage.page;
        setHasMore(resultPage.page < resultPage.total_pages);
        setLastSuccessfulQuery(termAtStart);
        await addRecentSearch(termAtStart);
        const nextRecents = await getRecentSearches();
        if (!cancelled && debouncedQueryRef.current === termAtStart) {
          setRecentSearches(nextRecents);
        }
      } catch (e) {
        if (cancelled || controller.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        if (debouncedQueryRef.current !== termAtStart) {
          return;
        }
        setData(null);
        setHasMore(false);
        searchPageRef.current = 0;
        setError(mapUnknownError(e));
      } finally {
        if (!cancelled && !controller.signal.aborted && debouncedQueryRef.current === termAtStart) {
          setLoading(false);
        }
      }
    })().catch(() => {
      /* handled in try/catch */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedQuery, movieGenres, searchRetryKey]);

  useEffect(() => {
    let cancelled = false;
    getRecentSearches().then((list) => {
      if (!cancelled) {
        setRecentSearches(list);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(() => {
    const term = debouncedQueryRef.current;
    if (term.length === 0 || loading || loadingMore || !hasMore) {
      return;
    }
    const nextPage = searchPageRef.current + 1;
    const sessionAtStart = searchSessionGenRef.current;
    setLoadingMore(true);
    (async () => {
      try {
        const genreId = genreIdForDebouncedQuery(term, movieGenresRef.current);
        const result =
          genreId != null
            ? discoverPageToSearchPage(
                await getDiscoverMovies({
                  page: nextPage,
                  sort_by: DISCOVER_SORT_POPULARITY,
                  with_genres: genreId,
                }),
              )
            : await searchMovies(term, {
                page: nextPage,
              });
        if (sessionAtStart !== searchSessionGenRef.current || debouncedQueryRef.current !== term) {
          return;
        }
        setData((prev) => ({
          ...result,
          results: mergeUniqueSearchMovieListById(prev?.results ?? [], result.results),
        }));
        searchPageRef.current = result.page;
        setHasMore(result.page < result.total_pages);
        setError(null);
      } catch (e) {
        if (
          sessionAtStart === searchSessionGenRef.current &&
          debouncedQueryRef.current === term &&
          !isLikelyCanceledRequest(e)
        ) {
          setError(mapUnknownError(e));
        }
      } finally {
        if (sessionAtStart === searchSessionGenRef.current) {
          setLoadingMore(false);
        }
      }
    })().catch(() => {
      if (sessionAtStart === searchSessionGenRef.current) {
        setLoadingMore(false);
      }
    });
  }, [hasMore, loading, loadingMore]);

  const refetch = useCallback(() => {
    if (debouncedQueryRef.current.length > 0) {
      setSearchRetryKey((k) => k + 1);
    } else {
      setTrendingReloadKey((k) => k + 1);
    }
  }, []);

  const refreshRecentSearches = useCallback(async () => {
    setRecentSearches(await getRecentSearches());
  }, []);

  const clearRecentSearches = useCallback(async () => {
    await clearRecentSearchesStorage();
    setRecentSearches([]);
  }, []);

  const applyGenreChip = useCallback(
    (label: string) => {
      const normalized = normalizeSearchTerm(label);
      if (normalized.length === 0) {
        return;
      }
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      genreBypassDebounceRef.current = true;
      setDebouncedQuery(normalized);
      setQuery?.(normalized);
    },
    [setQuery],
  );

  const mode = debouncedQuery.length === 0 ? 'default' : 'results';

  const snapshot = useMemo((): SearchTabSnapshot => {
    const results = data?.results ?? [];
    const totalResults = data?.total_results ?? 0;
    return {
      mode,
      debouncedQuery,
      searchPage: data,
      results,
      totalResults,
      searchLoading: loading,
      loadingMore,
      hasMore,
      searchError: error,
      loadMore,
      trending,
      trendingLoading,
      trendingError,
      recentSearches,
      refreshRecentSearches,
      clearRecentSearches,
      lastSuccessfulQuery,
      applyGenreChip,
      movieGenres,
      featuredRuntimeMinutes,
    };
  }, [
    mode,
    debouncedQuery,
    data,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    trending,
    trendingLoading,
    trendingError,
    recentSearches,
    refreshRecentSearches,
    clearRecentSearches,
    lastSuccessfulQuery,
    applyGenreChip,
    movieGenres,
    featuredRuntimeMinutes,
  ]);

  const envelopeLoading = mode === 'results' ? loading : trendingLoading;
  const envelopeError = mode === 'results' ? error : trendingError;

  return {
    data:
      mode === 'default' &&
      trendingLoading &&
      !hasSearchTrendingSettledRef.current
        ? null
        : snapshot,
    loading: envelopeLoading,
    error: envelopeError,
    refetch,
  };
}
