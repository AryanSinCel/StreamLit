import { TMDB_IMAGE_BASE_URL } from '@env';

/**
 * TMDB poster/backdrop path sizes — use with `buildImageUrl`.
 * Centralised next to URL builder per PSD-Architecture.
 */
export const TMDB_IMAGE_SIZE_W185 = 'w185';
export const TMDB_IMAGE_SIZE_W342 = 'w342';
export const TMDB_IMAGE_SIZE_W780 = 'w780';

/**
 * Builds `https://image.tmdb.org/t/p/{size}{path}` using `TMDB_IMAGE_BASE_URL` from `@env`
 * (no duplicated domain strings in feature code).
 * Returns `null` if `path` is null, undefined, or empty — never a broken URL.
 */
export function buildImageUrl(path: string | null | undefined, size: string): string | null {
  if (path == null || path.trim() === '') {
    return null;
  }

  const base = TMDB_IMAGE_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}/${size}${normalizedPath}`;
}
