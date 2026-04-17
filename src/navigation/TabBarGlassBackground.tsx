/**
 * Bottom tab bar — PSD §6.4: `BlurView` + `rgba(35, 35, 35, 0.70)` tint (`tabBarGlass`).
 */

import { BlurView } from '@react-native-community/blur';
import type { JSX } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { tabBarGlass } from '../theme/colors';

export function TabBarGlassBackground(): JSX.Element {
  const blurProps =
    Platform.OS === 'android'
      ? ({
          blurAmount: tabBarGlass.blurAmount,
          blurType: 'dark' as const,
          overlayColor: tabBarGlass.backgroundColor,
        } as const)
      : ({
          blurAmount: tabBarGlass.blurAmount,
          blurType: 'dark' as const,
          reducedTransparencyFallbackColor: tabBarGlass.backgroundColor,
        } as const);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <BlurView {...blurProps} style={StyleSheet.absoluteFill} />
      {Platform.OS === 'ios' ? (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tint]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tint: {
    backgroundColor: tabBarGlass.backgroundColor,
  },
});
