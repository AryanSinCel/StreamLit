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
  'headline-md': {
    fontFamily: fontManrope,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: lsEm(-0.01, 28),
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
