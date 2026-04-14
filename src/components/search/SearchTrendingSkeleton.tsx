/**
 * Shape-matched skeleton for Search default trending block — featured 16:9 + 2-col portrait grid (PSD-Search §3, §7 S6).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { contentCard } from '../../theme/colors';
import { radiusCardOuter, spacing, searchFeaturedHeroAspectRatio } from '../../theme/spacing';

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
  const gridGutter = spacing.md;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridGutter) / 2;

  return (
    <View accessibilityLabel="Loading trending" style={styles.host}>
      <View style={styles.featuredWrap}>
        <ShimmerBox style={styles.featuredCard} />
      </View>
      <View style={[styles.gridRow, { gap: gridGutter }]}>
        <MiniTrendingCardSkeleton colWidth={gridColWidth} />
        <MiniTrendingCardSkeleton colWidth={gridColWidth} />
      </View>
      <View style={[styles.gridRow, { gap: gridGutter, marginTop: spacing.xl }]}>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  host: {
    gap: 0,
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
    height: 12,
    marginTop: spacing.xs,
    width: '55%',
  },
  miniTitleLine: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: 18,
    width: '88%',
  },
});
