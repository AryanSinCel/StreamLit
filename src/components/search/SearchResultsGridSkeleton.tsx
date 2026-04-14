/**
 * Shape-matched skeleton for Search results — count line + 2-column poster grid (PSD-Search §4, §7 S6).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { contentCard } from '../../theme/colors';
import { radiusCardOuter, spacing } from '../../theme/spacing';

const SKELETON_ROW_COUNT = 3;

function ResultCardSkeleton({ colWidth }: { colWidth: number }): JSX.Element {
  const posterHeight = colWidth / contentCard.aspectRatio;
  return (
    <View style={[styles.card, { width: colWidth }]}>
      <ShimmerBox style={[styles.poster, { height: posterHeight }]} />
      <ShimmerBox style={styles.titleLine} />
      <ShimmerBox style={styles.yearLine} />
    </View>
  );
}

export function SearchResultsGridSkeleton(): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  const gridGutter = spacing.md;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridGutter) / 2;

  return (
    <View accessibilityLabel="Searching" style={styles.host}>
      <ShimmerBox style={styles.countLine} />
      <View style={styles.grid}>
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, row) => (
          <View key={row} style={[styles.gridRow, { gap: gridGutter }]}>
            <ResultCardSkeleton colWidth={gridColWidth} />
            <ResultCardSkeleton colWidth={gridColWidth} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  countLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: 14,
    marginBottom: spacing.xl,
    width: '72%',
  },
  grid: {
    gap: spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  host: {
    marginBottom: spacing.lg,
  },
  poster: {
    borderRadius: radiusCardOuter,
    width: '100%',
  },
  titleLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: 18,
    width: '90%',
  },
  yearLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: 12,
    marginTop: spacing.xs,
    width: '36%',
  },
});
