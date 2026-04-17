import type { JSX } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IconBookmarkAdd, IconBookmarkAdded } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { detailWatchlistCtaMinHeight, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type DetailWatchlistButtonProps = {
  hydrated: boolean;
  /** From store `items` only; button applies **`hydrated`** gate for visuals. */
  storedInWatchlist: boolean;
  onPress: () => void;
};

/**
 * `movie-showDetail.html` — gradient **Add to Watchlist** (`bookmark_add` + label) vs outlined **In Watchlist** (`bookmark_added`).
 */
export function DetailWatchlistButton({
  hydrated,
  storedInWatchlist,
  onPress,
}: DetailWatchlistButtonProps): JSX.Element {
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
        <IconBookmarkAdded color={colors.primary} size={22} />
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
      <LinearGradient
        accessibilityElementsHidden
        colors={[colors.primary, colors.primary_container]}
        end={{ x: 1, y: 1 }}
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.addInner}>
        <IconBookmarkAdd color={colors.on_primary_container} size={22} />
        <Text style={styles.addLabel}>Add to Watchlist</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  addLabel: {
    ...typography['title-sm'],
    color: colors.on_primary_container,
    fontWeight: '600',
  },
  addOuter: {
    alignItems: 'center',
    borderRadius: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: detailWatchlistCtaMinHeight,
    overflow: 'hidden',
    paddingVertical: spacing.sm,
  },
  addPressed: {
    opacity: 0.92,
  },
  hydratePlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.surface_container,
    borderRadius: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: detailWatchlistCtaMinHeight,
  },
  inListLabel: {
    ...typography['title-sm'],
    color: colors.primary,
    fontWeight: '600',
  },
  inListOuter: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.primary,
    borderRadius: spacing.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: detailWatchlistCtaMinHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inListPressed: {
    opacity: 0.92,
  },
});
