/**
 * Typed re-exports for @env (Babel injects values from `.env` at build time).
 * Keeps TMDB_* imports type-checked under strict TS without wiring API yet (Task 5).
 */
export {
  TMDB_ACCESS_TOKEN,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from '@env';
