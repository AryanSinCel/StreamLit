/**
 * Non-empty watchlist but current filter has no matches — PSD-Watchlist §4.
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { WatchlistMediaFilter } from '../../api/types';
import { colors } from '../../theme/colors';
import { radiusFullPill, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

function filterLabel(filter: WatchlistMediaFilter): string {
  switch (filter) {
    case 'movie':
      return 'Movies';
    case 'tv':
      return 'Series';
    default:
      return 'Titles';
  }
}

export type WatchlistFilterEmptyProps = {
  filter: WatchlistMediaFilter;
  onBrowseAll: () => void;
};

export function WatchlistFilterEmpty({ filter, onBrowseAll }: WatchlistFilterEmptyProps): JSX.Element {
  const label = filterLabel(filter);
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{`No ${label} in your watchlist yet`}</Text>
      <Pressable
        accessibilityHint="Shows all saved titles"
        accessibilityLabel="Browse All"
        accessibilityRole="button"
        onPress={onBrowseAll}
        style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      >
        <Text style={styles.chipLabel}>Browse All</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  message: {
    ...typography['headline-md'],
    color: colors.on_surface,
    textAlign: 'center',
  },
  chip: {
    backgroundColor: colors.secondary_container,
    borderRadius: radiusFullPill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + spacing.xs,
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
});
