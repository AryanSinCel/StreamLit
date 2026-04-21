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

/**
 * Human-readable length for metadata lines (`2h 15m`, `2h` on the hour; under 60m uses `N min`).
 * Matches Detail / Search featured copy.
 */
export function formatTmdbRuntimeCompact(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) {
      return `${String(h)}h`;
    }
    return `${String(h)}h ${String(m)}m`;
  }
  return `${String(minutes)} min`;
}
