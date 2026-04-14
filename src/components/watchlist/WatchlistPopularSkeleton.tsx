/**
 * Horizontal skeleton row for empty Watchlist “Popular recommendations” (PSD-Watchlist §5).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { contentCard } from '../../theme/colors';
import { homeRowCardWidth, radiusCardOuter, spacing } from '../../theme/spacing';

const SLOT_COUNT = 4;

export function WatchlistPopularSkeleton(): JSX.Element {
  const posterHeight = homeRowCardWidth / contentCard.aspectRatio;
  return (
    <View accessibilityLabel="Loading recommendations" style={styles.row}>
      {Array.from({ length: SLOT_COUNT }, (_, i) => (
        <View key={i} style={[styles.card, { width: homeRowCardWidth }]}>
          <ShimmerBox style={[styles.poster, { height: posterHeight }]} />
          <ShimmerBox style={styles.titleLine} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  card: {
    gap: spacing.sm,
  },
  poster: {
    borderRadius: radiusCardOuter,
    width: '100%',
  },
  titleLine: {
    alignSelf: 'stretch',
    borderRadius: spacing.xs,
    height: 14,
  },
});
