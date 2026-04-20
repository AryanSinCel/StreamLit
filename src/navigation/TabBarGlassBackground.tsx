/**
 * Bottom tab bar — PSD §6.4: `BlurView` + `rgba(35, 35, 35, 0.70)` tint (`tabBarGlass`).
 *
 * Android: skip `BlurView` for this slot. `@react-native-community/blur` on Android often dims or
 * blurs the whole activity when used as `tabBarBackground`, while root-stack screens (Detail, See
 * All) painted above the tab navigator look normal. A solid tint matches the PSD color without
 * that compositing bug.
 */

import { BlurView } from '@react-native-community/blur';
import type { JSX } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { tabBarGlass } from '../theme/colors';

export function TabBarGlassBackground(): JSX.Element {
  if (Platform.OS === 'android') {
    return (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.androidTint]} />
    );
  }

  const blurProps = {
    blurAmount: tabBarGlass.blurAmount,
    blurType: 'dark' as const,
    reducedTransparencyFallbackColor: tabBarGlass.backgroundColor,
  } as const;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <BlurView {...blurProps} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tint]} />
    </View>
  );
}

const styles = StyleSheet.create({
  androidTint: {
    backgroundColor: tabBarGlass.backgroundColor,
  },
  tint: {
    backgroundColor: tabBarGlass.backgroundColor,
  },
});
