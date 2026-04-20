import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DISCOVER_MIN_VOTE_COUNT,
  DISCOVER_SORT_POPULARITY,
  DISCOVER_SORT_VOTE_AVERAGE,
  getDiscoverMovies,
  getSimilarMovies,
  getTopRatedMovies,
  getTrendingMoviesWeek,
} from '../api/movies';
import type { DiscoverMoviesParams } from '../api/types';
import type { TmdbMovieListItem, TmdbPagedMoviesResponse } from '../api/types';
import type { SeeAllMode } from '../navigation/types';
import { mapUnknownError } from '../utils/mapUnknownError';

export interface UseSeeAllInput {
  mode: SeeAllMode;
  genreId?: number;
  /** When `mode === 'similar'`, anchor movie id for paginated similar. */
  similarSourceMovieId?: number;
  /** When `mode === 'discover'`, optional `sort_by` for `GET /discover/movie`. */
  discoverSortBy?: string;
}

/** Paginated list for See All — page 1 on mount / refetch; `loadMore` appends. */
export interface UseSeeAllResult {
  items: TmdbMovieListItem[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
}

async function fetchSeeAllPage(
  mode: SeeAllMode,
  genreId: number | undefined,
  similarSourceMovieId: number | undefined,
  discoverSortBy: string | undefined,
  page: number,
  signal: AbortSignal,
): Promise<TmdbPagedMoviesResponse> {
  switch (mode) {
    case 'trending':
      if (genreId !== undefined) {
        return getDiscoverMovies({
          page,
          with_genres: genreId,
          sort_by: DISCOVER_SORT_POPULARITY,
          signal,
        });
      }
      return getTrendingMoviesWeek({ page, signal });
    case 'top_rated':
      if (genreId !== undefined) {
        return getDiscoverMovies({
          page,
          with_genres: genreId,
          sort_by: DISCOVER_SORT_VOTE_AVERAGE,
          vote_count_gte: DISCOVER_MIN_VOTE_COUNT,
          signal,
        });
      }
      return getTopRatedMovies({ page, signal });
    case 'discover': {
      const params: DiscoverMoviesParams & { signal: AbortSignal } = { page, signal };
      if (genreId !== undefined) {
        params.with_genres = genreId;
      }
      if (discoverSortBy !== undefined) {
        params.sort_by = discoverSortBy;
      }
      return getDiscoverMovies(params);
    }
    case 'similar': {
      if (similarSourceMovieId === undefined || !Number.isFinite(similarSourceMovieId)) {
        throw new Error('similarSourceMovieId is required when mode is similar');
      }
      return getSimilarMovies(similarSourceMovieId, { page, signal });
    }
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export function useSeeAll(input: UseSeeAllInput): UseSeeAllResult {
  const { mode, genreId, similarSourceMovieId, discoverSortBy } = input;
  const [items, setItems] = useState<TmdbMovieListItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const fetchGenerationRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    fetchGenerationRef.current += 1;
    const generation = fetchGenerationRef.current;

    setLoading(true);
    setError(null);
    setLoadingMore(false);

    (async () => {
      try {
        const data = await fetchSeeAllPage(
          mode,
          genreId,
          similarSourceMovieId,
          discoverSortBy,
          1,
          controller.signal,
        );
        if (cancelled || generation !== fetchGenerationRef.current) {
          return;
        }
        setItems(data.results);
        setPage(data.page);
        setHasMore(data.page < data.total_pages);
      } catch (e) {
        if (cancelled || generation !== fetchGenerationRef.current) {
          return;
        }
        setItems([]);
        setPage(0);
        setHasMore(false);
        setError(mapUnknownError(e));
      } finally {
        if (!cancelled && generation === fetchGenerationRef.current) {
          setLoading(false);
        }
      }
    })().catch(() => {
      /* errors surfaced via setError */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [mode, genreId, similarSourceMovieId, discoverSortBy, reloadKey]);

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) {
      return;
    }
    const nextPage = page + 1;
    const generationAtStart = fetchGenerationRef.current;
    const controller = new AbortController();
    setLoadingMore(true);
    (async () => {
      try {
        const data = await fetchSeeAllPage(
          mode,
          genreId,
          similarSourceMovieId,
          discoverSortBy,
          nextPage,
          controller.signal,
        );
        if (generationAtStart !== fetchGenerationRef.current) {
          return;
        }
        setItems((prev) => [...prev, ...data.results]);
        setPage(data.page);
        setHasMore(data.page < data.total_pages);
        setError(null);
      } catch (e) {
        if (generationAtStart !== fetchGenerationRef.current) {
          return;
        }
        setError(mapUnknownError(e));
      } finally {
        if (generationAtStart === fetchGenerationRef.current) {
          setLoadingMore(false);
        }
      }
    })().catch(() => {
      if (generationAtStart === fetchGenerationRef.current) {
        setLoadingMore(false);
      }
    });
  }, [discoverSortBy, genreId, hasMore, loading, loadingMore, mode, page, similarSourceMovieId]);

  return {
    items,
    page,
    hasMore,
    loading,
    loadingMore,
    error,
    refetch,
    loadMore,
  };
}
