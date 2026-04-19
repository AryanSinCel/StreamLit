import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getMovieCredits, getMovieDetail, getSimilarMovies } from '../api/movies';
import type {
  MovieDetailSnapshot,
  TmdbMovieCreditsResponse,
  TmdbMovieDetail,
  TmdbPagedMoviesResponse,
  UseQueryResult,
} from '../api/types';
import { isLikelyCanceledRequest, mapUnknownError } from '../utils/mapUnknownError';

type SectionSlice<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function validMovieId(movieId: number): boolean {
  return Number.isFinite(movieId) && movieId > 0;
}

function emptySection<T>(): SectionSlice<T> {
  return { data: null, loading: false, error: null };
}

function noopRefetch(): void {
  /* invalid movie id — nothing to refetch */
}

/**
 * Detail: `GET /movie/{id}`, `/credits`, `/similar` in one **`Promise.allSettled`** (PSD-Detail §2.1),
 * with **independent** `details` / `credits` / `similar` state and per-section **`refetch`** (§2.2, **D2**).
 *
 * Top-level **`UseQueryResult`** semantics:
 * - **`loading`**: `true` only until the **initial** parallel batch for the current `movieId` settles
 *   (not during a single-section refetch).
 * - **`error`**: set only when the **details** slice fails with no data (hero is unusable). **`null`** when
 *   only credits/similar fail — those stay on the nested **`UseQueryResult`**s.
 * - **`refetch`**: retries **all three** sections (error-boundary / full retry).
 * - **`data`**: `null` when `movieId` is invalid; otherwise **`MovieDetailSnapshot`** with nested slices.
 */
export function useMovieDetail(movieId: number): UseQueryResult<MovieDetailSnapshot> {
  const [details, setDetails] = useState<SectionSlice<TmdbMovieDetail>>(emptySection);
  const [credits, setCredits] = useState<SectionSlice<TmdbMovieCreditsResponse>>(emptySection);
  const [similar, setSimilar] = useState<SectionSlice<TmdbPagedMoviesResponse>>(emptySection);
  const [initialBatchDone, setInitialBatchDone] = useState(false);

  const detailAbortRef = useRef<AbortController | null>(null);
  const creditsAbortRef = useRef<AbortController | null>(null);
  const similarAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    detailAbortRef.current?.abort();
    creditsAbortRef.current?.abort();
    similarAbortRef.current?.abort();

    if (!validMovieId(movieId)) {
      setDetails(emptySection());
      setCredits(emptySection());
      setSimilar(emptySection());
      setInitialBatchDone(true);
      return;
    }

    setInitialBatchDone(false);

    const batchController = new AbortController();
    let cancelled = false;

    setDetails({ data: null, loading: true, error: null });
    setCredits({ data: null, loading: true, error: null });
    setSimilar({ data: null, loading: true, error: null });

    async function runParallel(): Promise<void> {
      const settled = await Promise.allSettled([
        getMovieDetail(movieId, { signal: batchController.signal }),
        getMovieCredits(movieId, { signal: batchController.signal }),
        getSimilarMovies(movieId, { page: 1, signal: batchController.signal }),
      ]);

      if (cancelled || batchController.signal.aborted) {
        return;
      }

      const [detailOutcome, creditsOutcome, similarOutcome] = settled;

      if (detailOutcome.status === 'fulfilled') {
        setDetails({ data: detailOutcome.value, loading: false, error: null });
      } else if (!isLikelyCanceledRequest(detailOutcome.reason)) {
        setDetails({
          data: null,
          loading: false,
          error: mapUnknownError(detailOutcome.reason),
        });
      } else {
        setDetails((s) => ({ ...s, loading: false }));
      }

      if (creditsOutcome.status === 'fulfilled') {
        setCredits({ data: creditsOutcome.value, loading: false, error: null });
      } else if (!isLikelyCanceledRequest(creditsOutcome.reason)) {
        setCredits({
          data: null,
          loading: false,
          error: mapUnknownError(creditsOutcome.reason),
        });
      } else {
        setCredits((s) => ({ ...s, loading: false }));
      }

      if (similarOutcome.status === 'fulfilled') {
        setSimilar({ data: similarOutcome.value, loading: false, error: null });
      } else if (!isLikelyCanceledRequest(similarOutcome.reason)) {
        setSimilar({
          data: null,
          loading: false,
          error: mapUnknownError(similarOutcome.reason),
        });
      } else {
        setSimilar((s) => ({ ...s, loading: false }));
      }

      setInitialBatchDone(true);
    }

    runParallel().catch(() => {
      /* each branch above handles errors; rejections are unexpected */
    });

    return () => {
      cancelled = true;
      batchController.abort();
      detailAbortRef.current?.abort();
      creditsAbortRef.current?.abort();
      similarAbortRef.current?.abort();
    };
  }, [movieId]);

  const refetchDetails = useCallback(() => {
    if (!validMovieId(movieId)) {
      return;
    }
    detailAbortRef.current?.abort();
    const ac = new AbortController();
    detailAbortRef.current = ac;
    setDetails((s) => ({ ...s, loading: true, error: null }));
    getMovieDetail(movieId, { signal: ac.signal })
      .then((data) => {
        if (ac.signal.aborted) {
          return;
        }
        setDetails({ data, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        setDetails({ data: null, loading: false, error: mapUnknownError(e) });
      });
  }, [movieId]);

  const refetchCredits = useCallback(() => {
    if (!validMovieId(movieId)) {
      return;
    }
    creditsAbortRef.current?.abort();
    const ac = new AbortController();
    creditsAbortRef.current = ac;
    setCredits((s) => ({ ...s, loading: true, error: null }));
    getMovieCredits(movieId, { signal: ac.signal })
      .then((data) => {
        if (ac.signal.aborted) {
          return;
        }
        setCredits({ data, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        setCredits({ data: null, loading: false, error: mapUnknownError(e) });
      });
  }, [movieId]);

  const refetchSimilar = useCallback(() => {
    if (!validMovieId(movieId)) {
      return;
    }
    similarAbortRef.current?.abort();
    const ac = new AbortController();
    similarAbortRef.current = ac;
    setSimilar((s) => ({ ...s, loading: true, error: null }));
    getSimilarMovies(movieId, { page: 1, signal: ac.signal })
      .then((data) => {
        if (ac.signal.aborted) {
          return;
        }
        setSimilar({ data, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted || isLikelyCanceledRequest(e)) {
          return;
        }
        setSimilar({ data: null, loading: false, error: mapUnknownError(e) });
      });
  }, [movieId]);

  const refetchAll = useCallback(() => {
    refetchDetails();
    refetchCredits();
    refetchSimilar();
  }, [refetchCredits, refetchDetails, refetchSimilar]);

  const detailsQuery = useMemo(
    () => ({
      data: details.data,
      loading: details.loading,
      error: details.error,
      refetch: refetchDetails,
    }),
    [details.data, details.error, details.loading, refetchDetails],
  );

  const creditsQuery = useMemo(
    () => ({
      data: credits.data,
      loading: credits.loading,
      error: credits.error,
      refetch: refetchCredits,
    }),
    [credits.data, credits.error, credits.loading, refetchCredits],
  );

  const similarQuery = useMemo(
    () => ({
      data: similar.data,
      loading: similar.loading,
      error: similar.error,
      refetch: refetchSimilar,
    }),
    [similar.data, similar.error, similar.loading, refetchSimilar],
  );

  const data = useMemo((): MovieDetailSnapshot | null => {
    if (!validMovieId(movieId)) {
      return null;
    }
    return {
      details: detailsQuery,
      credits: creditsQuery,
      similar: similarQuery,
    };
  }, [creditsQuery, detailsQuery, movieId, similarQuery]);

  const loading = validMovieId(movieId) && !initialBatchDone;
  const error =
    validMovieId(movieId) && details.data == null && details.error != null ? details.error : null;

  return {
    data,
    loading,
    error,
    refetch: validMovieId(movieId) ? refetchAll : noopRefetch,
  };
}
