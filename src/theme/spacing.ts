/**
 * Spacing scale — use only these tokens in components (no magic numbers).
 * Base unit 4; extended steps for typography alignment where needed.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  xxxxl: 56,
} as const;

/** Portrait TMDB poster / content cards — use in StyleSheet instead of numeric literals. */
export const radiusCardOuter = 16 as const;
export const radiusCardInner = 12 as const;

/** Home layout — reference `resources/home.html` / PSD-Home. */
export const homeHeroHeight = 450 as const;
export const homeRowCardWidth = 160 as const;

/** Detail hero backdrop strip — `docs/PSD-Detail.md` §4 (~220px). */
export const detailHeroHeight = 220 as const;

/** Cast avatar diameter — PSD-Detail §4. */
export const detailCastAvatarSize = 60 as const;

/** Pill-shaped chips (genre strip) — large radius for capsule silhouette. */
export const radiusFullPill = 100 as const;

/** Search default featured hero — `resources/search.html` 16:9 landscape tile. */
export const searchFeaturedHeroAspectRatio = 16 / 9;
