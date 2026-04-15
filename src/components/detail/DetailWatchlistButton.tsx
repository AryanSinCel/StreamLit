import type { JSX } from 'react';
import { useId, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type DetailWatchlistButtonProps = {
  hydrated: boolean;
  /** From store `items` only; button applies **`hydrated`** gate for visuals. */
  storedInWatchlist: boolean;
  onPress: () => void;
};

/**
 * PSD-Detail §4 — default gradient “Add to Watchlist” vs **`surface_container_highest`** + outline “In Watchlist”.
 */
export function DetailWatchlistButton({
  hydrated,
  storedInWatchlist,
  onPress,
}: DetailWatchlistButtonProps): JSX.Element {
  const reactId = useId();
  const gradientId = useMemo(
    () => `watchlist-grad-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    [reactId],
  );

  if (!hydrated) {
    return (
      <View
        accessibilityState={{ busy: true }}
        accessibilityLabel="Watchlist status loading"
        style={styles.hydratePlaceholder}
      >
        <ActivityIndicator accessibilityElementsHidden color={colors.primary_container} />
      </View>
    );
  }

  if (storedInWatchlist) {
    return (
      <Pressable
        accessibilityHint="Removes this movie from your watchlist"
        accessibilityLabel="In Watchlist"
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.inListOuter, pressed && styles.inListPressed]}
      >
        <Text style={styles.inListLabel}>In Watchlist</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityHint="Saves this movie to your watchlist"
      accessibilityLabel="Add to Watchlist"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.addOuter, pressed && styles.addPressed]}
    >
      <Svg
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <Stop offset="0" stopColor={colors.primary} />
            <Stop offset="1" stopColor={colors.primary_container} />
          </LinearGradient>
        </Defs>
        <Rect fill={`url(#${gradientId})`} height="100%" width="100%" />
      </Svg>
      <Text style={styles.addLabel}>Add to Watchlist</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hydratePlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.surface_container,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    marginTop: spacing.xl,
    minHeight: spacing.xxxxl,
  },
  addOuter: {
    alignItems: 'center',
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    marginTop: spacing.xl,
    minHeight: spacing.xxxxl,
    overflow: 'hidden',
    paddingVertical: spacing.md,
  },
  addPressed: {
    opacity: 0.92,
  },
  addLabel: {
    ...typography['title-sm'],
    color: colors.on_primary,
    fontWeight: '700',
  },
  inListOuter: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderColor: colors.outline_variant,
    borderRadius: radiusCardInner,
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: spacing.xl,
    minHeight: spacing.xxxxl,
    paddingVertical: spacing.md,
  },
  inListPressed: {
    opacity: 0.92,
  },
  inListLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
});
