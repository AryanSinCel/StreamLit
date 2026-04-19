/**
 * Shape-matched skeleton for Search default trending block — featured 16:9 + 2-col portrait grid (PSD-Search §3, §7 S6).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { contentCard } from '../../theme/colors';
import { fill, layout, radiusCardOuter, spacing, searchFeaturedHeroAspectRatio } from '../../theme/spacing';

function MiniTrendingCardSkeleton({ colWidth }: { colWidth: number }): JSX.Element {
  const posterHeight = colWidth / contentCard.aspectRatio;
  return (
    <View style={[styles.miniCard, { width: colWidth }]}>
      <ShimmerBox style={[styles.miniPoster, { height: posterHeight }]} />
      <ShimmerBox style={styles.miniTitleLine} />
      <ShimmerBox style={styles.miniSubLine} />
    </View>
  );
}

export function SearchTrendingSkeleton(): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  /** Must match mini-grid row gap so two columns fit (same as SearchDefaultView trending grid). */
  const gridRowGap = spacing.xl;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridRowGap) / 2;

  return (
    <View accessibilityLabel="Loading trending" style={styles.host}>
      <View style={styles.featuredWrap}>
        <ShimmerBox style={styles.featuredCard} />
      </View>
      <View style={[styles.gridRow, { gap: gridRowGap }]}>
        <MiniTrendingCardSkeleton colWidth={gridColWidth} />
        <MiniTrendingCardSkeleton colWidth={gridColWidth} />
        <MiniTrendingCardSkeleton colWidth={gridColWidth} />
        <MiniTrendingCardSkeleton colWidth={gridColWidth} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    aspectRatio: searchFeaturedHeroAspectRatio,
    borderRadius: radiusCardOuter,
    width: '100%',
  },
  featuredWrap: {
    alignSelf: 'stretch',
    marginBottom: spacing.xl,
    width: '100%',
  },
  gridRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  host: {
    alignSelf: 'stretch',
    gap: fill.none,
    width: '100%',
  },
  miniCard: {
    gap: spacing.md,
  },
  miniPoster: {
    borderRadius: radiusCardOuter,
    width: '100%',
  },
  miniSubLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineXs,
    marginTop: spacing.xs,
    width: '55%',
  },
  miniTitleLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineMd,
    width: '88%',
  },
});
