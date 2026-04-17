/**
 * Skeleton for detail hero + pull-up block — mirrors `movie-showDetail.html` spacing.
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { detailHeroHeight, detailSimilarPosterWidth, layout, spacing } from '../../theme/spacing';

export type DetailDetailsSkeletonProps = {
  /** Full-bleed hero width (typically screen width). */
  heroWidth: number;
  /** Inner copy width (screen minus horizontal padding). */
  contentWidth: number;
};

export function DetailDetailsSkeleton({ heroWidth, contentWidth }: DetailDetailsSkeletonProps): JSX.Element {
  const hw = Math.max(1, heroWidth);
  const cw = Math.max(1, contentWidth);
  return (
    <View style={styles.block}>
      <ShimmerBox style={[styles.hero, { height: detailHeroHeight, width: hw }]} />
      <View style={[styles.inner, { marginTop: -spacing.xxl }]}>
        <ShimmerBox style={[styles.titleLine, { width: cw * 0.72 }]} />
        <View style={styles.chipRow}>
          <ShimmerBox style={styles.chip} />
          <ShimmerBox style={styles.chip} />
          <ShimmerBox style={styles.chipWide} />
        </View>
        <ShimmerBox style={[styles.line, { width: cw }]} />
        <ShimmerBox style={[styles.line, { width: cw }]} />
        <ShimmerBox style={[styles.line, { width: cw * 0.55 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.md,
  },
  chip: {
    borderRadius: spacing.sm,
    height: layout.skeletonBlockLg,
    width: detailSimilarPosterWidth * 0.35,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  chipWide: {
    borderRadius: spacing.sm,
    height: layout.skeletonBlockLg,
    width: detailSimilarPosterWidth * 0.55,
  },
  hero: {
    alignSelf: 'stretch',
  },
  inner: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  line: {
    borderRadius: spacing.xs,
    height: layout.skeletonLineSm,
  },
  titleLine: {
    borderRadius: spacing.xs,
    height: layout.skeletonBlockXl,
  },
});
