/**
 * Detail overlay bar — `movie-showDetail.html`: full-width `backdrop-blur-xl` + `bg-neutral-900/70`,
 * `px-6 py-4`, `w-10 h-10` circular hits + `hover:bg-white/10`; Material Symbols Outlined back/share.
 */

import { BlurView } from '@react-native-community/blur';
import type { JSX } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconArrowBack, IconShareOutlined } from '../common/SimpleIcons';
import { colors, detailNavBarBlur } from '../../theme/colors';
import { elevation, fill, radiusFullPill, spacing } from '../../theme/spacing';

export type DetailNavBarProps = {
  onBack: () => void;
};

const ICON_SIZE = 24;

export function DetailNavBar({ onBack }: DetailNavBarProps): JSX.Element {
  const insets = useSafeAreaInsets();

  /**
   * Android: `@react-native-community/blur` + `overlayColor` stacks a heavy tint on top of blur and
   * can compositor-weird with absolute overlays (see `TabBarGlassBackground` — solid tint only).
   * iOS: blur + separate tint matches `movie-showDetail.html`.
   */
  const iosBlurProps = {
    blurAmount: detailNavBarBlur.blurAmountIos,
    blurType: 'dark' as const,
    reducedTransparencyFallbackColor: colors.surface,
  } as const;

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.xl,
          paddingTop: insets.top + spacing.lg,
        },
      ]}
      pointerEvents="box-none"
    >
      {Platform.OS === 'android' ? (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tintOverlay]} />
      ) : (
        <>
          <BlurView {...iosBlurProps} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tintOverlay]} />
        </>
      )}
      <View style={styles.row} pointerEvents="box-none">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onBack}
          style={({ pressed }) => [styles.iconHit, pressed && styles.iconHitPressed]}
        >
          <IconArrowBack color={colors.on_surface} size={ICON_SIZE} />
        </Pressable>
        <Pressable
          accessibilityHint="Sharing is not available yet"
          accessibilityLabel="Share"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={() => {
            Alert.alert('Share', 'Coming soon', [{ text: 'OK' }]);
          }}
          style={({ pressed }) => [styles.iconHit, pressed && styles.iconHitPressed]}
        >
          <IconShareOutlined color={colors.on_surface} size={ICON_SIZE} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    left: fill.none,
    overflow: 'hidden',
    position: 'absolute',
    right: fill.none,
    top: fill.none,
    zIndex: elevation.nav,
  },
  tintOverlay: {
    backgroundColor: colors.detail_nav_bar_tint,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconHit: {
    alignItems: 'center',
    borderRadius: radiusFullPill,
    height: spacing.xxxl,
    justifyContent: 'center',
    width: spacing.xxxl,
  },
  iconHitPressed: {
    backgroundColor: colors.detail_nav_icon_pressed,
  },
});
