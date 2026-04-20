/**
 * Cinematic Curator — single source for colour values.
 * No hardcoded hex/rgba outside this module in app code.
 * No-line rule: no solid 1px layout borders — use spacing + backgrounds only.
 * Never `#FFFFFF` for body text — use `on_surface` / `on_surface_variant`.
 *
 * For scrims and shadows, prefer **`surfaceRgba`** / **`surfaceContainerLowestRgba`** /
 * **`surfaceContainerRgba`** instead of repeating the same RGB under different names.
 */

import { radiusCardInner, radiusCardOuter } from './spacing';

/** `#131313` (`surface`) — use for hero/detail scrims and shadows at varying opacity. */
export function surfaceRgba(alpha: number): string {
  return `rgba(19, 19, 19, ${alpha})`;
}

/** `#0E0E0E` (`surface_container_lowest`) — featured / rail bottom fades. */
export function surfaceContainerLowestRgba(alpha: number): string {
  return `rgba(14, 14, 14, ${alpha})`;
}

/** `#232323` (`surface_container`) — tab bar glass tint (PSD §6.4). */
export function surfaceContainerRgba(alpha: number): string {
  return `rgba(35, 35, 35, ${alpha})`;
}

export const colors = {
  surface: '#131313',
  surface_container_lowest: '#0E0E0E',
  surface_container_low: '#1C1B1B',
  surface_container: '#232323',
  surface_container_high: '#2A2A2A',
  surface_container_highest: '#353534',
  surface_bright: '#3A3939',
  primary: '#FFB3AE',
  primary_container: '#FF5351',
  secondary_container: '#822625',
  /** Text / icons on `primary` surfaces (matches `resources/home.html` on-primary). */
  on_primary: '#68000B',
  /** Text on `primary_container` (e.g. hero “New Release” badge). */
  on_primary_container: '#5C0008',
  /** Header wordmark accent (matches `home.html` #E5383B). Active tab uses `primary_container`. */
  brand_coral: '#E5383B',
  on_surface: '#E5E2E1',
  on_surface_variant: '#E4BDBA',
  /** TextInput placeholder — `search.html` on-surface-variant ~50% (not in body text). */
  search_placeholder: 'rgba(229, 226, 225, 0.5)',
  /** Search field focus ring (`search.html` / `search-result.html` `ring-primary-container/30`). */
  search_input_focus_ring: 'rgba(255, 83, 81, 0.35)',
  /** Rating pill on posters — `search.html` (`bg-black/40` over stills). */
  poster_rating_scrim: 'rgba(0, 0, 0, 0.4)',
  /** Bottom tab icons when inactive (`home.html` ~60% opacity on variant). */
  tab_icon_inactive: 'rgba(228, 189, 186, 0.6)',
  /** Tab bar solid fallback (`home.html` #131313 @ 70%) — same RGB as `surface`. */
  tab_bar_scrim: surfaceRgba(0.7),
  outline_variant: 'rgba(255,255,255,0.15)',
  /** Empty watchlist icon disc ring — `watchlist-empty.html` `ring-outline-variant/10`. */
  outline_variant_ring: 'rgba(255, 255, 255, 0.04)',
  /** Hero title / synopsis legibility — same RGB as `surface`. */
  hero_text_shadow: surfaceRgba(0.85),
  /** Watchlist empty-state radial glow (`resources/watchlist-empty.html` `.bg-empty-glow`). */
  watchlist_empty_radial_glow: 'rgba(130, 38, 37, 0.15)',
  /** `surface_container_low` @ 30% — bookmark icon disc behind (`watchlist-empty.html`). */
  watchlist_empty_icon_disc: 'rgba(28, 27, 27, 0.3)',
  /**
   * Watchlist grid **Details** CTA — Stitch `border-outline-variant/15` on `surface-container-highest`.
   */
  watchlist_details_cta_border: 'rgba(255, 255, 255, 0.023)',
  /** Cast avatar ring — `ring-outline-variant/20` in `movie-showDetail.html`. */
  detail_cast_avatar_ring: 'rgba(255, 255, 255, 0.08)',
  /**
   * Detail metadata **rating** chip fill — `movie-showDetail.html` (`bg-secondary-container/30`).
   * RGB matches `secondary_container` (`#822625`).
   */
  detail_rating_chip_background: 'rgba(130, 38, 37, 0.3)',
  /**
   * Detail top nav tint — `movie-showDetail.html` (`bg-neutral-900/70` over `backdrop-blur-xl`).
   * Tailwind `neutral-900` #171717 @ 70%.
   */
  detail_nav_bar_tint: 'rgba(23, 23, 23, 0.7)',
  /** Detail nav icon hit — `hover:bg-white/10` in `movie-showDetail.html`. */
  detail_nav_icon_pressed: 'rgba(255, 255, 255, 0.1)',
} as const;

/** Tab bar “glass” — PSD §6.4: `BlurView` + tint (`MainTabs` `tabBarBackground`). */
export const tabBarGlass = {
  backgroundColor: surfaceContainerRgba(0.7),
  blurAmount: 20,
} as const;

/** Detail top bar — `movie-showDetail.html` `backdrop-blur-xl` (Tailwind ≈ 24px); iOS `BlurView` only. */
export const detailNavBarBlur = {
  blurAmountIos: 24,
} as const;

/** Poster / content cards — portrait ratio and corner radii. */
export const contentCard = {
  /** Portrait aspect width : height = 2 : 3 */
  aspectRatio: 2 / 3,
  radiusOuter: radiusCardOuter,
  radiusInner: radiusCardInner,
} as const;

/**
 * Skeleton / shimmer reference (full Animated wiring in a later task).
 * Base fill: `surface_container_high`; highlight sweep toward `surface_bright`.
 * Loop duration target ~1.5s for the shimmer cycle.
 */
export const skeletonShimmer = {
  baseColor: colors.surface_container_high,
  highlightColor: colors.surface_bright,
  durationMs: 1500,
} as const;
