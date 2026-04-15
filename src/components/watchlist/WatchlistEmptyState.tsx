/**
 * Watchlist zero-items body — `resources/watchlist-empty.html` (glow, disc + bookmark, copy, solid CTA, ghost row).
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TmdbPagedMoviesResponse, UseQueryResult } from '../../api/types';
import { BrandSolidCtaButton } from '../common/BrandSolidCtaButton';
import { GhostPosterPlaceholderGrid } from '../common/GhostPosterPlaceholderGrid';
import { RadialGlowBackdrop } from '../common/RadialGlowBackdrop';
import { IconBookmark } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { radiusFullPill, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const EMPTY_ICON_SIZE = spacing.xxxxl + spacing.lg;
/** Glow canvas behind the bookmark only — keeps highlight off the headline (`watchlist-empty.html`). */
const ICON_RADIAL_GLOW_SIZE = spacing.xxxxl * 4;

export type WatchlistEmptyStateProps = {
  ctaWidth: number;
  popularRecommendations: UseQueryResult<TmdbPagedMoviesResponse>;
  onBrowseTrending: () => void;
};

export function WatchlistEmptyState({
  ctaWidth,
  popularRecommendations,
  onBrowseTrending,
}: WatchlistEmptyStateProps): JSX.Element {
  const { loading, error, refetch } = popularRecommendations;
  const ghostGap = spacing.xl;
  const ghostPosterWidth = Math.max(1, (ctaWidth - ghostGap) / 2);

  return (
    <View style={styles.block}>
      <View style={[styles.emptyCluster, { width: ctaWidth }]}>
        <View style={styles.iconGlowCluster}>
          <RadialGlowBackdrop height={ICON_RADIAL_GLOW_SIZE} width={ICON_RADIAL_GLOW_SIZE} />
          <View style={styles.disc} accessibilityRole="image" accessibilityLabel="Empty watchlist">
            <View style={styles.discIconDim}>
              <IconBookmark color={colors.secondary_container} size={EMPTY_ICON_SIZE} />
            </View>
          </View>
        </View>
        <Text style={styles.headline}>Your watchlist is empty</Text>
        <Text style={styles.body}>
          {"Save movies and shows you want to watch later and they'll appear here"}
        </Text>
        <BrandSolidCtaButton
          accessibilityHint="Switches to the Home tab"
          accessibilityLabel="Browse Trending Now"
          label="Browse Trending Now"
          onPress={onBrowseTrending}
          width={ctaWidth}
        />
      </View>

      {error != null && !loading ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityLabel="Retry loading recommendations"
            accessibilityRole="button"
            onPress={refetch}
            style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
          >
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={styles.ghostSection}
      >
        <Text style={styles.sectionLabel}>Popular Recommendations</Text>
        <GhostPosterPlaceholderGrid count={2} gap={ghostGap} posterWidth={ghostPosterWidth} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingBottom: spacing.xxl,
  },
  emptyCluster: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  iconGlowCluster: {
    alignItems: 'center',
    alignSelf: 'center',
    height: ICON_RADIAL_GLOW_SIZE,
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.md,
    position: 'relative',
    width: ICON_RADIAL_GLOW_SIZE,
  },
  disc: {
    alignItems: 'center',
    backgroundColor: colors.watchlist_empty_icon_disc,
    borderRadius: radiusFullPill,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  discIconDim: {
    opacity: 0.5,
  },
  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    lineHeight: 22,
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  ghostSection: {
    alignSelf: 'stretch',
    marginTop: spacing.xxxl + spacing.xxxl,
    opacity: 0.2,
  },
  sectionLabel: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontFamily: typography['headline-md'].fontFamily,
    letterSpacing: 2,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
  },
  errorBlock: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryBtnPressed: {
    opacity: 0.88,
  },
  retryLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
});
