/**
 * Skeleton for **`details`** section only — hero + title + chip + synopsis lines (PSD-Detail §2.2, D3).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { detailHeroHeight, homeRowCardWidth, radiusCardInner, spacing } from '../../theme/spacing';

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
      <View style={styles.inner}>
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
    borderRadius: radiusCardInner,
    height: 28,
    width: homeRowCardWidth * 0.35,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipWide: {
    borderRadius: radiusCardInner,
    height: 28,
    width: homeRowCardWidth * 0.55,
  },
  hero: {
    alignSelf: 'center',
    borderRadius: radiusCardInner,
  },
  inner: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  line: {
    borderRadius: spacing.xs,
    height: 14,
  },
  titleLine: {
    borderRadius: spacing.xs,
    height: 36,
  },
});
