import { useCallback, useEffect, useState } from 'react';
import { getMovieDetail } from '../api/movies';
import type { TmdbMovieDetail, UseQueryResult } from '../api/types';
import { mapUnknownError } from '../utils/mapUnknownError';

/** Detail: main movie record for `movieId` via `movies.ts`. */
export function useMovieDetail(movieId: number): UseQueryResult<TmdbMovieDetail> {
  const [data, setData] = useState<TmdbMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(movieId) || movieId <= 0) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await getMovieDetail(movieId, { signal: controller.signal });
        if (!cancelled) {
          setData(result);
        }
      } catch (e) {
        if (cancelled || controller.signal.aborted) {
          return;
        }
        setData(null);
        setError(mapUnknownError(e));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load().catch(() => {
      /* errors surfaced via setError inside load */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [movieId, reloadKey]);

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return { data, loading, error, refetch };
}
