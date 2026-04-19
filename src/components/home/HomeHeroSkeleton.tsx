/**
 * Hero layout skeleton — matches `HomeHero` shell + bottom text / CTA stack (PSD-Home H6).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { fill, homeHeroHeight, layout, radiusCardInner, spacing } from '../../theme/spacing';

export function HomeHeroSkeleton(): JSX.Element {
  return (
    <View style={styles.wrap} accessibilityLabel="Loading featured title">
      <View style={styles.shell}>
        <ShimmerBox style={styles.backdrop} />
        <View style={styles.content}>
          <ShimmerBox style={styles.badge} />
          <ShimmerBox style={styles.titleLine} />
          <ShimmerBox style={styles.titleLineShort} />
          <ShimmerBox style={styles.synopsisLine} />
          <ShimmerBox style={styles.synopsisLineShort} />
          <View style={styles.actions}>
            <ShimmerBox style={styles.watchBtn} />
            <ShimmerBox style={styles.detailsBtn} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: spacing.md,
    marginTop: fill.none,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardInner,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonBlockMd,
    marginBottom: spacing.lg,
    width: layout.skeletonPosterWide,
  },
  content: {
    bottom: fill.none,
    justifyContent: 'flex-end',
    left: fill.none,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xxxl,
    position: 'absolute',
    right: fill.none,
  },
  detailsBtn: {
    borderRadius: spacing.md,
    flex: 1,
    height: layout.skeletonTitle,
    minWidth: fill.none,
  },
  shell: {
    borderRadius: radiusCardInner,
    height: homeHeroHeight,
    overflow: 'hidden',
    width: '100%',
  },
  synopsisLine: {
    borderRadius: spacing.xs,
    height: layout.skeletonLineSm,
    marginTop: spacing.sm,
    maxWidth: layout.contentMaxMd,
    width: '100%',
  },
  synopsisLineShort: {
    borderRadius: spacing.xs,
    height: layout.skeletonLineSm,
    marginBottom: spacing.xxl,
    marginTop: spacing.xs,
    maxWidth: layout.contentMaxNarrow,
    width: '82%',
  },
  titleLine: {
    borderRadius: spacing.xs,
    height: layout.skeletonBlockLg,
    marginBottom: spacing.sm,
    width: '88%',
  },
  titleLineShort: {
    borderRadius: spacing.xs,
    height: layout.skeletonBlockMd,
    marginBottom: spacing.lg,
    width: '55%',
  },
  watchBtn: {
    borderRadius: spacing.md,
    flex: 1,
    height: layout.skeletonTitle,
    minWidth: fill.none,
  },
  wrap: {
    marginBottom: spacing.xxxxl,
    paddingHorizontal: spacing.xxl,
  },
});
