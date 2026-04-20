/**
 * Hero layout skeleton — matches `HomeHero` shell + bottom text / CTA stack (PSD-Home H6).
 */

import type { JSX } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import {
  fill,
  homeHeroHeight,
  homeHeroWidthRatio,
  layout,
  radiusCardOuter,
  spacing,
} from '../../theme/spacing';

export function HomeHeroSkeleton(): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const heroWidth = Math.max(1, Math.round(windowWidth * homeHeroWidthRatio));

  return (
    <View style={styles.wrap} accessibilityLabel="Loading featured title">
      <View style={[styles.shell, { width: heroWidth }]}>
        <ShimmerBox style={styles.backdrop} />
        <View style={styles.content}>
          <ShimmerBox style={styles.badge} />
          <ShimmerBox style={styles.titleLine} />
          <ShimmerBox style={styles.titleLineShort} />
          <View style={styles.synopsisColumn}>
            <ShimmerBox style={styles.synopsisLine} />
            <ShimmerBox style={styles.synopsisLineShort} />
            <View style={styles.actions}>
              <ShimmerBox style={styles.watchBtn} />
              <ShimmerBox style={styles.detailsBtn} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginTop: fill.none,
    width: '100%',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardOuter,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonBlockMd,
    marginBottom: spacing.lg,
    width: layout.skeletonPosterWide,
  },
  content: {
    alignItems: 'flex-start',
    bottom: fill.none,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    left: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    position: 'absolute',
    right: spacing.xxxl,
    top: fill.none,
  },
  detailsBtn: {
    borderRadius: spacing.md,
    height: layout.skeletonTitle,
    width: layout.skeletonPosterWide + spacing.xxl,
  },
  shell: {
    alignSelf: 'center',
    borderRadius: radiusCardOuter,
    height: homeHeroHeight,
    overflow: 'hidden',
  },
  synopsisColumn: {
    alignSelf: 'flex-start',
    maxWidth: layout.contentMaxMd,
    width: '100%',
  },
  synopsisLine: {
    borderRadius: spacing.xs,
    height: layout.skeletonLineSm,
    marginTop: spacing.sm,
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
    height: layout.skeletonTitle,
    width: layout.skeletonPosterWide + spacing.xxxl + spacing.lg,
  },
  wrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: spacing.xxxxl,
  },
});
