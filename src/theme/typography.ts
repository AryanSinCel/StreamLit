/**
 * Typography tokens — Manrope + Inter loaded via `@expo-google-fonts/*` TTFs + `react-native-asset` (PSD §3 / §6.2).
 * `fontFamily` values match linked TTF PostScript names.
 */
import type { TextStyle } from 'react-native';
import { fontFamilies } from './fontFamilies';
import { tracking } from './spacing';

/** `letterSpacing` in px ≈ em × fontSize for RN. */
const lsEm = (em: number, fontSize: number): number => em * fontSize;

export const typography = {
  'display-lg': {
    fontFamily: fontFamilies.manropeExtraBold,
    fontSize: 56,
    fontWeight: '800' as const,
    letterSpacing: lsEm(-0.02, 56),
  },
  /** PSD-Watchlist §7.4 main title (“My Watchlist”) — 40px Manrope 800. */
  'display-md': {
    fontFamily: fontFamilies.manropeExtraBold,
    fontSize: 40,
    fontWeight: '800' as const,
    letterSpacing: lsEm(-0.02, 40),
  },
  /** Detail cast actor — `movie-showDetail.html` (`text-[11px] font-semibold`). */
  'detail-cast-name': {
    fontFamily: fontFamilies.interSemiBold,
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: tracking.none,
    lineHeight: 14,
  },
  /** Detail cast character — `movie-showDetail.html` (`text-[10px]`). */
  'detail-cast-role': {
    fontFamily: fontFamilies.interRegular,
    fontSize: 10,
    fontWeight: '400' as const,
    letterSpacing: tracking.none,
    lineHeight: 13,
  },
  /** Detail “More Like This” poster title — `movie-showDetail.html` (`text-xs font-medium`). */
  'detail-similar-title': {
    fontFamily: fontFamilies.interMedium,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: tracking.none,
    lineHeight: 16,
  },
  /** Watchlist grid card title — Stitch (`text-lg font-bold` / Manrope). */
  'watchlist-card-title': {
    fontFamily: fontFamilies.manropeBold,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: lsEm(-0.01, 18),
    lineHeight: 22,
  },
  /** Watchlist empty “0 titles” — `resources/watchlist-empty.html` (body, `font-medium`). */
  'watchlist-count-line': {
    fontFamily: fontFamilies.interMedium,
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: tracking.none,
  },
  /** Watchlist empty CTA label — `resources/watchlist-empty.html` (`text-lg font-bold`). */
  'watchlist-cta-label': {
    fontFamily: fontFamilies.manropeBold,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: tracking.none,
  },
  'headline-md': {
    fontFamily: fontFamilies.manropeBold,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: lsEm(-0.01, 28),
  },
  /** Search section titles — `resources/search.html` (`text-xl font-bold` / Manrope). */
  'headline-search': {
    fontFamily: fontFamilies.manropeBold,
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: lsEm(-0.01, 20),
  },
  /** Search / trending grid card titles — `search.html` (`font-headline … text-base`). */
  'title-search-card': {
    fontFamily: fontFamilies.manropeBold,
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: tracking.none,
  },
  /** Search bar typed value — `search-result.html` (`text-lg font-medium`). */
  'search-input-value': {
    fontFamily: fontFamilies.interMedium,
    fontSize: 18,
    fontWeight: '500' as const,
    letterSpacing: tracking.none,
  },
  'title-lg': {
    fontFamily: fontFamilies.manropeSemiBold,
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: tracking.none,
  },
  /** App bar wordmark — `resources/home.html` (Manrope ~text-2xl / black). */
  'brand-wordmark': {
    fontFamily: fontFamilies.manropeExtraBold,
    fontSize: 24,
    fontWeight: '800' as const,
    letterSpacing: lsEm(-0.03, 24),
  },
  'title-sm': {
    fontFamily: fontFamilies.interSemiBold,
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: tracking.none,
  },
  /**
   * Home hero “Watch Now” / “Details” only — Figma ~16px (global `title-sm` stays 14px for other screens).
   */
  'home-hero-cta': {
    fontFamily: fontFamilies.interSemiBold,
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: tracking.none,
  },
  'body-md': {
    fontFamily: fontFamilies.interRegular,
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: tracking.none,
  },
  'label-sm': {
    fontFamily: fontFamilies.interRegular,
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: tracking.none,
  },
  /** Detail plain metadata chips — `movie-showDetail.html` (`text-xs font-medium text-on-surface-variant`). */
  'detail-metadata-chip': {
    fontFamily: fontFamilies.interMedium,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: tracking.none,
  },
  /** Detail rating chip — `movie-showDetail.html` (`text-xs font-bold text-secondary`). */
  'detail-rating-chip': {
    fontFamily: fontFamilies.interBold,
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: tracking.none,
  },
  /** Hero “New Release” pill — `resources/home.html` (10px, wide tracking, uppercase). */
  'hero-badge': {
    fontFamily: fontFamilies.interBold,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: lsEm(0.2, 10),
    textTransform: 'uppercase' as const,
  },
  /** Bottom tab labels — `resources/home.html` nav (10px, wide tracking, uppercase). */
  'tab-label': {
    fontFamily: fontFamilies.interMedium,
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: tracking.caps,
    textTransform: 'uppercase' as const,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
