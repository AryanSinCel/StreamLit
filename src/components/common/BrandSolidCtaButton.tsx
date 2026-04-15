/**
 * Full-width solid brand CTA — `resources/watchlist-empty.html` “Browse Trending Now”.
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type BrandSolidCtaButtonProps = {
  width: number;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export function BrandSolidCtaButton({
  width,
  label,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: BrandSolidCtaButtonProps): JSX.Element {
  const w = Math.max(0, width);
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.hit, pressed && styles.hitPressed]}
    >
      <View style={[styles.inner, { borderRadius: radiusCardInner, width: w }]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignSelf: 'stretch',
  },
  hitPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  inner: {
    alignItems: 'center',
    backgroundColor: colors.brand_coral,
    justifyContent: 'center',
    minHeight: spacing.xxxl + spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    shadowColor: colors.secondary_container,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  label: {
    ...typography['watchlist-cta-label'],
    color: colors.on_surface,
    textAlign: 'center',
  },
});
