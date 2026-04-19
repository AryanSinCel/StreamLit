/**
 * Watchlist tab hydrate skeleton — header strip + filter tray + 2-column grid (matches populated layout intent).
 */

import type { JSX } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { colors, contentCard } from '../../theme/colors';
import { layout, radiusCardInner, radiusCardOuter, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const GRID_ROWS = 3;

function GridCellSkeleton({ colWidth }: { colWidth: number }): JSX.Element {
  const posterHeight = colWidth / contentCard.aspectRatio;
  return (
    <View style={[styles.card, { width: colWidth }]}>
      <ShimmerBox style={[styles.poster, { height: posterHeight }]} />
      <ShimmerBox style={styles.titleLine} />
      <ShimmerBox style={styles.metaLine} />
    </View>
  );
}

export function WatchlistScreenSkeleton(): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  const gridGutter = spacing.md;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridGutter) / 2;

  return (
    <View accessibilityLabel="Loading watchlist" style={styles.root}>
      <View style={styles.headerCluster}>
        <View style={styles.titleBlock}>
          <ShimmerBox style={styles.kickerLine} />
          <ShimmerBox style={styles.titleLineHero} />
        </View>
        <View style={styles.chipTray}>
          <ShimmerBox style={styles.chipPill} />
          <ShimmerBox style={styles.chipPill} />
          <ShimmerBox style={styles.chipPill} />
        </View>
      </View>

      <View style={styles.grid}>
        {Array.from({ length: GRID_ROWS }, (_, row) => (
          <View key={row} style={[styles.gridRow, { gap: gridGutter }]}>
            <GridCellSkeleton colWidth={gridColWidth} />
            <GridCellSkeleton colWidth={gridColWidth} />
          </View>
        ))}
      </View>

      <Text style={styles.loadingHint}>Loading…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  chipPill: {
    borderRadius: layout.chipRadiusSm,
    height: spacing.xxxl,
    width: spacing.xxxxl + spacing.lg,
  },
  chipTray: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.surface_container_high,
    borderRadius: radiusCardOuter,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg + spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  grid: {
    gap: spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerCluster: {
    marginBottom: spacing.xl,
  },
  titleBlock: {
    alignSelf: 'stretch',
  },
  kickerLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineSm,
    marginBottom: spacing.sm,
    width: '40%',
  },
  loadingHint: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  metaLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineXs,
    marginTop: spacing.xs,
    width: '36%',
  },
  poster: {
    borderRadius: radiusCardInner,
    width: '100%',
  },
  root: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  titleLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineMd,
    width: '90%',
  },
  titleLineHero: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonTitle,
    width: '72%',
  },
});
