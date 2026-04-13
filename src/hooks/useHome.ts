import type { UseQueryResult } from '../api/types';

/** Task 8+: Home data via `movies.ts`. */

export function useHome(): UseQueryResult<unknown> {
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => {},
  };
}
