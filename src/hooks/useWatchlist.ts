import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getMovieGenres, getSimilarMovies, getTopRatedMovies, getTrendingMoviesWeek } from '../api/movies';
import type {
  TmdbGenre,
  TmdbPagedMoviesResponse,
  UseQueryResult,
  WatchlistMediaFilter,
  WatchlistSnapshot,
} from '../api/types';
import { useWatchlistStore } from '../store/watchlistStore';
import { filterWatchlistItems, getWatchlistSimilarMovieAnchorId } from '../utils/watchlistFilters';
import { isLikelyCanceledRequest, mapUnknownError } from '../utils/mapUnknownError';

/**
 * Watchlist orchestration: filtered local items + similar movies for the tail anchor (PSD-Watchlist §7 W1).
 *
 * Top-level **`UseQueryResult`** semantics:
 * - **`loading`**: `true` only while the persisted watchlist (**AsyncStorage**) is not yet rehydrated.
 * - **`error`**: always **`null`** — TMDB failures use **`similar`** / **`popularRecommendations`** / **`trendingContents`**. **`refetch`** retries those remote slices.
 */
export function useWatchlist(): UseQueryResult<WatchlistSnapshot> {
  const { items, count, hydrated } = useWatchlistStore(
    useShallow((s) => ({
      items: s.items,
      count: s.count,
      hydrated: s.hydrated,
    })),
  );

  const [filter, setFilter] = useState<WatchlistMediaFilter>('all');
  const filteredItems = useMemo(() => filterWatchlistItems(items, filter), [items, filter]);

  const similarAnchorId = useMemo(
    () => (hydrated ? getWatchlistSimilarMovieAnchorId(items) : null),
    [hydrated, items],
  );

  const [similarData, setSimilarData] = useState<TmdbPagedMoviesResponse | null>(null);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState<string | null>(null);
  const [similarReloadKey, setSimilarReloadKey] = useState(0);

  const shouldLoadPopular = hydrated && count === 0;

  const [popularData, setPopularData] = useState<TmdbPagedMoviesResponse | null>(null);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularError, setPopularError] = useState<string | null>(null);
  const [popularReloadKey, setPopularReloadKey] = useState(0);

  const [trendingEmptyData, setTrendingEmptyData] = useState<TmdbPagedMoviesResponse | null>(null);
  const [trendingEmptyLoading, setTrendingEmptyLoading] = useState(false);
  const [trendingEmptyError, setTrendingEmptyError] = useState<string | null>(null);
  const [trendingEmptyReloadKey, setTrendingEmptyReloadKey] = useState(0);

  const [movieGenres, setMovieGenres] = useState<readonly TmdbGenre[]>([]);

  const shouldLoadGenres = hydrated && count > 0;

  useEffect(() => {
    if (!shouldLoadGenres) {
      setMovieGenres([]);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const res = await getMovieGenres({ signal: controller.signal });
        if (!cancelled) {
          setMovieGenres(res.genres);
        }
      } catch (e) {
        if (cancelled || controller.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        setMovieGenres([]);
      }
    })().catch(() => {
      /* non-fatal — grid falls back to year + media kind */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [shouldLoadGenres]);

  useEffect(() => {
    const anchorId = similarAnchorId;
    if (anchorId === null) {
      setSimilarData(null);
      setSimilarLoading(false);
      setSimilarError(null);
      return;
    }

    const movieId: number = anchorId;
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setSimilarLoading(true);
      setSimilarError(null);
      try {
        const result = await getSimilarMovies(movieId, { signal: controller.signal });
        if (!cancelled) {
          setSimilarData(result);
        }
      } catch (e) {
        if (cancelled || controller.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        setSimilarData(null);
        setSimilarError(mapUnknownError(e));
      } finally {
        if (!cancelled) {
          setSimilarLoading(false);
        }
      }
    }

    load().catch(() => {
      /* surfaced via setSimilarError */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [similarAnchorId, similarReloadKey]);

  useEffect(() => {
    if (!shouldLoadPopular) {
      setPopularData(null);
      setPopularLoading(false);
      setPopularError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function loadPopular() {
      setPopularLoading(true);
      setPopularError(null);
      try {
        const result = await getTopRatedMovies({ page: 1, signal: controller.signal });
        if (!cancelled) {
          setPopularData(result);
        }
      } catch (e) {
        if (cancelled || controller.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        setPopularData(null);
        setPopularError(mapUnknownError(e));
      } finally {
        if (!cancelled) {
          setPopularLoading(false);
        }
      }
    }

    loadPopular().catch(() => {
      /* surfaced via setPopularError */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [shouldLoadPopular, popularReloadKey]);

  useEffect(() => {
    if (!shouldLoadPopular) {
      setTrendingEmptyData(null);
      setTrendingEmptyLoading(false);
      setTrendingEmptyError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function loadTrendingEmpty() {
      setTrendingEmptyLoading(true);
      setTrendingEmptyError(null);
      try {
        const result = await getTrendingMoviesWeek({ page: 1, signal: controller.signal });
        if (!cancelled) {
          setTrendingEmptyData(result);
        }
      } catch (e) {
        if (cancelled || controller.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        setTrendingEmptyData(null);
        setTrendingEmptyError(mapUnknownError(e));
      } finally {
        if (!cancelled) {
          setTrendingEmptyLoading(false);
        }
      }
    }

    loadTrendingEmpty().catch(() => {
      /* surfaced via setTrendingEmptyError */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [shouldLoadPopular, trendingEmptyReloadKey]);

  const refetchSimilar = useCallback(() => {
    setSimilarReloadKey((k) => k + 1);
  }, []);

  const refetchPopular = useCallback(() => {
    setPopularReloadKey((k) => k + 1);
  }, []);

  const refetchTrendingEmpty = useCallback(() => {
    setTrendingEmptyReloadKey((k) => k + 1);
  }, []);

  const similar = useMemo(
    () => ({
      data: similarData,
      loading: similarLoading,
      error: similarError,
      refetch: refetchSimilar,
    }),
    [similarData, similarError, similarLoading, refetchSimilar],
  );

  const popularRecommendations = useMemo(
    () => ({
      data: popularData,
      loading: popularLoading,
      error: popularError,
      refetch: refetchPopular,
    }),
    [popularData, popularError, popularLoading, refetchPopular],
  );

  const trendingContents = useMemo(
    () => ({
      data: trendingEmptyData,
      loading: trendingEmptyLoading,
      error: trendingEmptyError,
      refetch: refetchTrendingEmpty,
    }),
    [refetchTrendingEmpty, trendingEmptyData, trendingEmptyError, trendingEmptyLoading],
  );

  const refetch = useCallback(() => {
    refetchSimilar();
    refetchPopular();
    refetchTrendingEmpty();
  }, [refetchSimilar, refetchPopular, refetchTrendingEmpty]);

  const data = useMemo((): WatchlistSnapshot | null => {
    if (!hydrated) {
      return null;
    }
    return {
      hydrated,
      count,
      items,
      filter,
      setFilter,
      filteredItems,
      similar,
      popularRecommendations,
      trendingContents,
      movieGenres,
    };
  }, [
    count,
    filteredItems,
    filter,
    hydrated,
    items,
    movieGenres,
    popularRecommendations,
    similar,
    trendingContents,
  ]);

  return {
    data,
    loading: !hydrated,
    error: null,
    refetch,
  };
}
