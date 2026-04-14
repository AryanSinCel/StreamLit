/**
 * Cinematic Curator — single source for colour values.
 * No hardcoded hex/rgba outside this module in app code.
 * No-line rule: no solid 1px layout borders — use spacing + backgrounds only.
 * Never `#FFFFFF` for body text — use `on_surface` / `on_surface_variant`.
 */

import { radiusCardInner, radiusCardOuter } from './spacing';

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
  /** Header wordmark + active tab accent (matches `home.html` #E5383B). */
  brand_coral: '#E5383B',
  on_surface: '#E5E2E1',
  on_surface_variant: '#E4BDBA',
  /** Bottom tab icons when inactive (`home.html` ~60% opacity on variant). */
  tab_icon_inactive: 'rgba(228, 189, 186, 0.6)',
  /** Tab bar scrim (`home.html` #131313 @ 70%). */
  tab_bar_scrim: 'rgba(19, 19, 19, 0.70)',
  outline_variant: 'rgba(255,255,255,0.15)',
  /** Hero title / synopsis legibility when scrim is omitted (no solid overlay panel). */
  hero_text_shadow: 'rgba(19, 19, 19, 0.85)',
} as const;

/** Primary CTA gradient — use with `LinearGradient` when building UI. */
export const primaryGradient = {
  colors: ['#FFB3AE', '#FF5351'] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;

/**
 * Tab bar “glass” — background for later `@react-native-community/blur` usage.
 * Prefer these constants; install blur package when wiring the tab bar.
 */
export const tabBarGlass = {
  backgroundColor: 'rgba(35, 35, 35, 0.70)',
  blurAmount: 20,
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
