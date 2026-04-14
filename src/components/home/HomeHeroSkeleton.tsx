/**
 * Hero layout skeleton — matches `HomeHero` shell + bottom text / CTA stack (PSD-Home H6).
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { homeHeroHeight, radiusCardInner, spacing } from '../../theme/spacing';

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
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardInner,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: 24,
    marginBottom: spacing.md,
    width: 120,
  },
  content: {
    bottom: 0,
    justifyContent: 'flex-end',
    left: 0,
    padding: spacing.xl,
    position: 'absolute',
    right: 0,
  },
  detailsBtn: {
    borderRadius: spacing.md,
    height: 48,
    width: 120,
  },
  shell: {
    borderRadius: radiusCardInner,
    height: homeHeroHeight,
    overflow: 'hidden',
    width: '100%',
  },
  synopsisLine: {
    borderRadius: spacing.xs,
    height: 14,
    marginTop: spacing.sm,
    maxWidth: 320,
    width: '100%',
  },
  synopsisLineShort: {
    borderRadius: spacing.xs,
    height: 14,
    marginTop: spacing.xs,
    maxWidth: 260,
    width: '82%',
  },
  titleLine: {
    borderRadius: spacing.xs,
    height: 28,
    marginBottom: spacing.sm,
    width: '88%',
  },
  titleLineShort: {
    borderRadius: spacing.xs,
    height: 24,
    marginBottom: spacing.md,
    width: '55%',
  },
  watchBtn: {
    borderRadius: spacing.md,
    height: 48,
    width: 160,
  },
  wrap: {
    marginBottom: spacing.xxxxl,
    paddingHorizontal: spacing.xxl,
  },
});
