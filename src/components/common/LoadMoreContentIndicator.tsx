/**
 * PSD `resources/home.html` — infinite scroll: spinner + uppercase label
 * (`on_surface_variant`, `label-sm`, wide tracking, row `opacity` 0.4).
 */

import type { JSX } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, tracking } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type LoadMoreContentIndicatorProps = {
  /** When true, shows the row; when false, renders nothing. */
  active: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LoadMoreContentIndicator({
  active,
  style,
}: LoadMoreContentIndicatorProps): JSX.Element | null {
  if (!active) {
    return null;
  }
  return (
    <View
      accessibilityLabel="Loading more content"
      accessibilityRole="progressbar"
      style={[styles.row, style]}
    >
      <ActivityIndicator color={colors.primary} size="small" />
      <Text style={styles.label}>Loading more content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontWeight: '700',
    letterSpacing: tracking.caps,
    marginLeft: spacing.md,
    textTransform: 'uppercase',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    opacity: 0.4,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
});
