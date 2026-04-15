/**
 * Shared TMDB → UI rules (PSD-Detail §3; `movielist-project` null-safety).
 */

/** Rating chip / badge: omit when absent, non-finite, or **`0`** (PSD-Detail §3). */
export function showTmdbVoteAverageBadge(voteAverage: number | null | undefined): boolean {
  return (
    typeof voteAverage === 'number' &&
    Number.isFinite(voteAverage) &&
    !Number.isNaN(voteAverage) &&
    voteAverage > 0
  );
}

/** One-decimal display for poster rating pills (`search.html`, `ContentCard`). */
export function formatTmdbVoteAverageLabel(voteAverage: number): string {
  return voteAverage >= 10 ? '10' : voteAverage.toFixed(1);
}

/** Runtime chip: omit when missing, non-finite, or **`0`** (PSD-Detail §3). */
export function showTmdbRuntimeChip(runtime: number | null | undefined): boolean {
  return typeof runtime === 'number' && Number.isFinite(runtime) && !Number.isNaN(runtime) && runtime > 0;
}
