/**
 * Per-section error + retry — PSD-Detail §2.2 (independent from other sections).
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { opacity, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type DetailSectionErrorProps = {
  message: string;
  onRetry: () => void;
  retryAccessibilityLabel: string;
};

export function DetailSectionError({
  message,
  onRetry,
  retryAccessibilityLabel,
}: DetailSectionErrorProps): JSX.Element {
  return (
    <View style={styles.block}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityLabel={retryAccessibilityLabel}
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonLabel}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: opacity.control,
  },
  message: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
});
