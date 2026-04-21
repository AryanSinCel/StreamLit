/**
 * Linked via `react-native.config.js` + `npx react-native-asset` (`@expo-google-fonts/manrope` / `inter`).
 * iOS vs Android use different registered `fontFamily` strings — keep **`Platform.select` here only**;
 * **`typography.ts`** references these tokens and keeps weights / sizes (no `Platform` there).
 */
import { Platform } from 'react-native';

export const fontFamilies = {
  manropeExtraBold: Platform.select({
    ios: 'Manrope-ExtraBold',
    android: 'Manrope_800ExtraBold',
    default: 'Manrope_800ExtraBold',
  }),
  manropeBold: Platform.select({
    ios: 'Manrope-Bold',
    android: 'Manrope_700Bold',
    default: 'Manrope_700Bold',
  }),
  manropeSemiBold: Platform.select({
    ios: 'Manrope-SemiBold',
    android: 'Manrope_600SemiBold',
    default: 'Manrope_600SemiBold',
  }),
  interRegular: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter_400Regular',
    default: 'Inter_400Regular',
  }),
  interMedium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter_500Medium',
    default: 'Inter_500Medium',
  }),
  interSemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter_600SemiBold',
    default: 'Inter_600SemiBold',
  }),
  interBold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter_700Bold',
    default: 'Inter_700Bold',
  }),
} as const;
