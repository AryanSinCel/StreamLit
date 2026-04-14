import { useCallback, useEffect, useState } from 'react';
import { getHomeData } from '../api/movies';
import type { HomeData, UseQueryResult } from '../api/types';
import { mapUnknownError } from '../utils/mapUnknownError';

/** Home: trending + top rated + genres via `movies.ts`. */
export function useHome(): UseQueryResult<HomeData> {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await getHomeData({ signal: controller.signal });
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
  }, [reloadKey]);

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return { data, loading, error, refetch };
}
