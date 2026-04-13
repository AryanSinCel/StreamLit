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
