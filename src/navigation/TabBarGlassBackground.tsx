/**
 * Bottom tab bar — frosted **`BlurView`** + a thin **`surface_container`** tint (`tabBarGlass`).
 *
 * - **iOS:** `ultraThinMaterialDark` (not `dark`) so the material stays legible without crushing
 *   backdrop contrast; tint is a light veil only.
 * - **Android:** explicit transparent `overlayColor` removes the library’s default dim layer on top
 *   of blur; tint is still the separate `View` under our control.
 */

import { BlurView } from '@react-native-community/blur';
import type { JSX } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { tabBarGlass } from '../theme/colors';
import { radiusCardInner } from '../theme/spacing';

export function TabBarGlassBackground(): JSX.Element {
  const iosBlurProps = {
    blurAmount: tabBarGlass.blurAmount,
    blurType: 'ultraThinMaterialDark' as const,
    reducedTransparencyFallbackColor: tabBarGlass.backgroundColor,
  } as const;

  const androidBlurProps = {
    blurAmount: 32,
    blurType: 'dark' as const,
    overlayColor: 'transparent',
  } as const;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.blurRoot]}>
      {Platform.OS === 'android' ? (
        <BlurView {...androidBlurProps} style={StyleSheet.absoluteFill} />
      ) : (
        <BlurView {...iosBlurProps} style={StyleSheet.absoluteFill} />
      )}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tint]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blurRoot: {
    borderTopLeftRadius: radiusCardInner,
    borderTopRightRadius: radiusCardInner,
    overflow: 'hidden',
  },
  tint: {
    backgroundColor: tabBarGlass.backgroundColor,
  },
});
