/**
 * Typography tokens — Manrope (display / headlines / title-lg), Inter (title-sm / body / label).
 * TODO: Load Manrope + Inter via `react-native-google-fonts` (or project font pipeline) and
 *       align `fontFamily` below with loaded names if they differ on each platform.
 */
import type { TextStyle } from 'react-native';

const fontManrope = 'Manrope';
const fontInter = 'Inter';

/** `letterSpacing` in px ≈ em × fontSize for RN. */
const lsEm = (em: number, fontSize: number): number => em * fontSize;

export const typography = {
  'display-lg': {
    fontFamily: fontManrope,
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: lsEm(-0.02, 56),
  },
  'display-md': {
    fontFamily: fontManrope,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: lsEm(-0.02, 40),
  },
  /** Watchlist grid card title — Stitch (`text-lg font-bold` / Manrope). */
  'watchlist-card-title': {
    fontFamily: fontManrope,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: lsEm(-0.01, 18),
    lineHeight: 22,
  },
  /** Watchlist main title — `resources/watchlist.html` (`text-4xl font-extrabold`). */
  'watchlist-screen-title': {
    fontFamily: fontManrope,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: lsEm(-0.02, 36),
  },
  /** Watchlist empty “0 titles” — `resources/watchlist-empty.html` (body, `font-medium`). */
  'watchlist-count-line': {
    fontFamily: fontInter,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
  },
  /** Watchlist empty CTA label — `resources/watchlist-empty.html` (`text-lg font-bold`). */
  'watchlist-cta-label': {
    fontFamily: fontManrope,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
  },
  'headline-md': {
    fontFamily: fontManrope,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: lsEm(-0.01, 28),
  },
  /** Home rail section titles — `resources/home.html` (`text-2xl` / Manrope bold). */
  'headline-rail': {
    fontFamily: fontManrope,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: lsEm(-0.01, 24),
  },
  /** Search section titles — `resources/search.html` (`text-xl font-bold` / Manrope). */
  'headline-search': {
    fontFamily: fontManrope,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: lsEm(-0.01, 20),
  },
  /** Search / trending grid card titles — `search.html` (`font-headline … text-base`). */
  'title-search-card': {
    fontFamily: fontManrope,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  /** Search bar typed value — `search-result.html` (`text-lg font-medium`). */
  'search-input-value': {
    fontFamily: fontInter,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0,
  },
  'title-lg': {
    fontFamily: fontManrope,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
  },
  /** App bar wordmark — `resources/home.html` (Manrope ~text-2xl / black). */
  'brand-wordmark': {
    fontFamily: fontManrope,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: lsEm(-0.03, 24),
  },
  'title-sm': {
    fontFamily: fontInter,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  'body-md': {
    fontFamily: fontInter,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
  },
  'label-sm': {
    fontFamily: fontInter,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  },
  /** Hero “New Release” pill — `resources/home.html` (10px, wide tracking, uppercase). */
  'hero-badge': {
    fontFamily: fontInter,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: lsEm(0.2, 10),
    textTransform: 'uppercase',
  },
  /** Bottom tab labels — `resources/home.html` nav (10px, wide tracking, uppercase). */
  'tab-label': {
    fontFamily: fontInter,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
