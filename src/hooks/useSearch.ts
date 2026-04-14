import { useCallback, useEffect, useState } from 'react';
import { searchMovies } from '../api/movies';
import type { SearchMoviesData, UseQueryResult } from '../api/types';
import { mapUnknownError } from '../utils/mapUnknownError';

/** Search: paginated movie results for `query` (debounce out of scope for Task 8). */
export function useSearch(query: string): UseQueryResult<SearchMoviesData> {
  const trimmed = query.trim();
  const [data, setData] = useState<SearchMoviesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (trimmed.length === 0) {
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
        const result = await searchMovies(trimmed, {
          page: 1,
          signal: controller.signal,
        });
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
  }, [trimmed, reloadKey]);

  const refetch = useCallback(() => {
    if (trimmed.length === 0) {
      return;
    }
    setReloadKey((k) => k + 1);
  }, [trimmed]);

  return { data, loading, error, refetch };
}
