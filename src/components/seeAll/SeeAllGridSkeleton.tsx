/**
 * Shape-matched 2-column poster grid for See All loading (PSD-Home list intent; mirrors Search grid skeleton without count line).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { contentCard } from '../../theme/colors';
import { layout, radiusCardInner, spacing } from '../../theme/spacing';

const ROW_COUNT = 4;

function CellSkeleton({ colWidth }: { colWidth: number }): JSX.Element {
  const posterHeight = colWidth / contentCard.aspectRatio;
  return (
    <View style={[styles.card, { width: colWidth }]}>
      <ShimmerBox style={[styles.poster, { height: posterHeight }]} />
      <ShimmerBox style={styles.titleLine} />
      <ShimmerBox style={styles.yearLine} />
    </View>
  );
}

export function SeeAllGridSkeleton(): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  const gridGutter = spacing.md;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridGutter) / 2;

  return (
    <View accessibilityLabel="Loading list" style={styles.host}>
      <View style={styles.grid}>
        {Array.from({ length: ROW_COUNT }, (_, row) => (
          <View key={row} style={[styles.gridRow, { gap: gridGutter }]}>
            <CellSkeleton colWidth={gridColWidth} />
            <CellSkeleton colWidth={gridColWidth} />
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
  grid: {
    gap: spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  host: {
    paddingTop: spacing.md,
  },
  poster: {
    borderRadius: radiusCardInner,
    width: '100%',
  },
  titleLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineMd,
    width: '90%',
  },
  yearLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineXs,
    marginTop: spacing.xs,
    width: '36%',
  },
});
