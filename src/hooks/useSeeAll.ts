import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getDiscoverMovies,
  getSimilarMovies,
  getTopRatedMovies,
  getTrendingMoviesWeek,
} from '../api/movies';
import type { TmdbMovieListItem, TmdbPagedMoviesResponse } from '../api/types';
import type { SeeAllMode } from '../navigation/types';
import { mapUnknownError } from '../utils/mapUnknownError';

export interface UseSeeAllInput {
  mode: SeeAllMode;
  genreId?: number;
  /** When `mode === 'similar'`, anchor movie id for paginated similar. */
  similarSourceMovieId?: number;
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
  page: number,
  signal: AbortSignal,
): Promise<TmdbPagedMoviesResponse> {
  switch (mode) {
    case 'trending':
      return getTrendingMoviesWeek({ page, signal });
    case 'top_rated':
      return getTopRatedMovies({ page, signal });
    case 'discover':
      if (genreId !== undefined) {
        return getDiscoverMovies({ page, with_genres: genreId, signal });
      }
      return getDiscoverMovies({ page, signal });
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
  const { mode, genreId, similarSourceMovieId } = input;
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
        const data = await fetchSeeAllPage(mode, genreId, similarSourceMovieId, 1, controller.signal);
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
  }, [mode, genreId, similarSourceMovieId, reloadKey]);

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
  }, [genreId, hasMore, loading, loadingMore, mode, page, similarSourceMovieId]);

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
