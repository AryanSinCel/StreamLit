import type { UseQueryResult } from '../api/types';

/** Task 8+: Detail data via `movies.ts`. */

export function useMovieDetail(): UseQueryResult<unknown> {
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => {},
  };
}
