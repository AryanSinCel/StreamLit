/**
 * Search tab orchestration (PSD-Search §1–2.2, §7 S3): debounced TMDB search, abortable requests,
 * default-mode trending, recent searches persistence. Screens stay thin — no TMDB calls here beyond `movies.ts`.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getTrendingMoviesWeek, searchMovies } from '../api/movies';
import type {
  TmdbPagedMoviesResponse,
  TmdbPagedSearchMoviesResponse,
  UseSearchInput,
  UseSearchResult,
} from '../api/types';
import {
  addRecentSearch,
  clearRecentSearches as clearRecentSearchesStorage,
  getRecentSearches,
  normalizeSearchTerm,
} from '../utils/recentSearches';
import { isLikelyCanceledRequest, mapUnknownError } from '../utils/mapUnknownError';

const SEARCH_DEBOUNCE_MS = 400;

export function useSearch({ query, setQuery }: UseSearchInput): UseSearchResult {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const genreBypassDebounceRef = useRef(false);
  const debouncedQueryRef = useRef('');
  const searchAbortRef = useRef<AbortController | null>(null);

  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [data, setData] = useState<TmdbPagedSearchMoviesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRetryKey, setSearchRetryKey] = useState(0);
  const [lastSuccessfulQuery, setLastSuccessfulQuery] = useState<string | null>(null);

  const [trending, setTrending] = useState<TmdbPagedMoviesResponse | null>(null);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [trendingReloadKey, setTrendingReloadKey] = useState(0);

  const [recentSearches, setRecentSearches] = useState<readonly string[]>([]);

  debouncedQueryRef.current = debouncedQuery;

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

  /** Debounced / retried movie search + completed-search recents. */
  useEffect(() => {
    const term = debouncedQuery;
    if (term.length === 0) {
      searchAbortRef.current?.abort();
      searchAbortRef.current = null;
      setData(null);
      setLoading(false);
      setError(null);
      setLastSuccessfulQuery(null);
      return;
    }

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    const termAtStart = term;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await searchMovies(termAtStart, {
          page: 1,
          signal: controller.signal,
        });
        if (cancelled || controller.signal.aborted) {
          return;
        }
        if (debouncedQueryRef.current !== termAtStart) {
          return;
        }
        setData(result);
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
  }, [debouncedQuery, searchRetryKey]);

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

  const refetch = useCallback(() => {
    if (debouncedQueryRef.current.length > 0) {
      setSearchRetryKey((k) => k + 1);
    }
  }, []);

  const refetchTrending = useCallback(() => {
    setTrendingReloadKey((k) => k + 1);
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
  const results = data?.results ?? [];
  const totalResults = data?.total_results ?? 0;

  return {
    mode,
    debouncedQuery,
    data,
    results,
    totalResults,
    loading,
    error,
    refetch,
    trending,
    trendingLoading,
    trendingError,
    refetchTrending,
    recentSearches,
    refreshRecentSearches,
    clearRecentSearches,
    lastSuccessfulQuery,
    applyGenreChip,
  };
}
