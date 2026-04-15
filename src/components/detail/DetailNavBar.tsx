/**
 * Detail stack top row — PSD-Detail §4 (back, share placeholder).
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconArrowBack, IconShare } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export type DetailNavBarProps = {
  onBack: () => void;
};

export function DetailNavBar({ onBack }: DetailNavBarProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: insets.top + spacing.sm }]}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={spacing.sm}
        onPress={onBack}
        style={({ pressed }) => [styles.hit, pressed && styles.hitPressed]}
      >
        <IconArrowBack color={colors.on_surface} size={26} />
      </Pressable>
      <Pressable
        accessibilityHint="Sharing is not available yet"
        accessibilityLabel="Share"
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        disabled
        hitSlop={spacing.sm}
        style={({ pressed }) => [styles.hit, styles.shareDisabled, pressed && styles.hitPressed]}
      >
        <IconShare color={colors.on_surface_variant} size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hit: {
    padding: spacing.xs,
  },
  hitPressed: {
    opacity: 0.88,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  shareDisabled: {
    opacity: 0.65,
  },
});
