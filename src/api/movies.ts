/**
 * TMDB endpoints — import only `client` from `./client` (no raw axios).
 *
 * **Smoke verify (dev):** with Metro running, temporarily add to `App.tsx`:
 * ```ts
 * import { getConfigurationSmoke } from './src/api/movies';
 * useEffect(() => {
 *   if (__DEV__) {
 *     getConfigurationSmoke().then(console.log).catch(console.error);
 *   }
 * }, []);
 * ```
 * Remove after confirming logs show configuration JSON (Bearer + interceptors OK).
 */

import { client } from './client';
import type { TmdbConfigurationResponse } from './types';

/** Single smoke GET — proves Bearer auth + interceptors; not a feature endpoint. */
export async function getConfigurationSmoke(): Promise<TmdbConfigurationResponse> {
  const { data } = await client.get<TmdbConfigurationResponse>('/configuration');
  return data;
}
