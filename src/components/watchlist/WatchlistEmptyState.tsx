/**
 * Watchlist zero-items body — `resources/watchlist-empty.html` / `watchlist_empty.png`:
 * glow, disc + bookmark, copy, solid CTA, then Popular Recommendations (trending API + `ContentCard` grid).
 */

import type { JSX } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieListItem, TmdbPagedMoviesResponse, UseQueryResult } from '../../api/types';
import { BrandSolidCtaButton } from '../common/BrandSolidCtaButton';
import { ContentCard } from '../common/ContentCard';
import { GhostPosterPlaceholderGrid } from '../common/GhostPosterPlaceholderGrid';
import { RadialGlowBackdrop } from '../common/RadialGlowBackdrop';
import { IconBookmark } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { radiusFullPill, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatListMovieSubtitle } from '../../utils/formatMovieListItem';

/** `watchlist-empty.html` `text-8xl` bookmark (~96px). */
const EMPTY_ICON_SIZE = spacing.xxxxl + spacing.xxl + spacing.sm;
/** Glow canvas behind the bookmark only — keeps highlight off the headline (`watchlist-empty.html`). */
const ICON_RADIAL_GLOW_SIZE = spacing.xxxxl * 4;
const POPULAR_GRID_MAX = 4;
/** ~0.2em letter-spacing on 12px label — `watchlist-empty.html` “Popular Recommendations”. */
const POPULAR_SECTION_TRACKING = 2.4;

function listItemTitle(item: TmdbMovieListItem): string {
  const t = item.title?.trim() ?? '';
  return t.length > 0 ? t : '—';
}

export type WatchlistEmptyStateProps = {
  ctaWidth: number;
  popularRecommendations: UseQueryResult<TmdbPagedMoviesResponse>;
  onBrowseTrending: () => void;
  onPressRecommendation: (movieId: number) => void;
};

export function WatchlistEmptyState({
  ctaWidth,
  popularRecommendations,
  onBrowseTrending,
  onPressRecommendation,
}: WatchlistEmptyStateProps): JSX.Element {
  const { data, loading, error, refetch } = popularRecommendations;
  const gridRowGap = spacing.xl;
  const gridColWidth = Math.max(1, (ctaWidth - gridRowGap) / 2);

  const popularMovies = useMemo(
    () => (data?.results ?? []).slice(0, POPULAR_GRID_MAX),
    [data?.results],
  );

  return (
    <View style={styles.block}>
      <View style={styles.centerSlot}>
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

      <View style={[styles.recommendationsSection, loading ? styles.recommendationsGhost : null]}>
        <Text style={styles.sectionLabel}>Popular Recommendations</Text>
        {loading ? (
          <GhostPosterPlaceholderGrid count={POPULAR_GRID_MAX} gap={gridRowGap} posterWidth={gridColWidth} />
        ) : popularMovies.length > 0 ? (
          <View style={[styles.recGrid, { gap: gridRowGap, width: ctaWidth }]}>
            {popularMovies.map((movie) => (
              <View key={movie.id} style={{ width: gridColWidth }}>
                <ContentCard
                  onPress={() => {
                    onPressRecommendation(movie.id);
                  }}
                  posterPath={movie.poster_path}
                  rating={movie.vote_average}
                  style={{ width: gridColWidth }}
                  subtitle={formatListMovieSubtitle(movie)}
                  title={listItemTitle(movie)}
                />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    lineHeight: 24,
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  centerSlot: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 0,
  },
  disc: {
    alignItems: 'center',
    backgroundColor: colors.watchlist_empty_icon_disc,
    borderColor: colors.outline_variant_ring,
    borderRadius: radiusFullPill,
    borderWidth: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  discIconDim: {
    opacity: 0.5,
  },
  emptyCluster: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
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
  headline: {
    ...typography['headline-rail'],
    color: colors.on_surface,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  iconGlowCluster: {
    alignItems: 'center',
    alignSelf: 'center',
    height: ICON_RADIAL_GLOW_SIZE,
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    position: 'relative',
    width: ICON_RADIAL_GLOW_SIZE,
  },
  recommendationsGhost: {
    opacity: 0.2,
    pointerEvents: 'none',
  },
  recGrid: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  recommendationsSection: {
    alignSelf: 'stretch',
    marginTop: spacing.xxxl * 2,
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
  sectionLabel: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontFamily: typography['headline-md'].fontFamily,
    fontWeight: '500',
    letterSpacing: POPULAR_SECTION_TRACKING,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
  },
});
