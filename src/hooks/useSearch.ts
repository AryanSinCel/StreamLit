import type { UseQueryResult } from '../api/types';

/** Task 8+: Search data via `movies.ts`. */

export function useSearch(): UseQueryResult<unknown> {
  return {
    data: null,
    loading: false,
    error: null,
    refetch: () => {},
  };
}
