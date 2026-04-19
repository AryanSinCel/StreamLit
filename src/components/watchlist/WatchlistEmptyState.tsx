/**
 * Watchlist zero-items body — `resources/watchlist-empty.html` / `watchlist_empty.png`:
 * glow, disc + bookmark, copy, solid CTA, then Popular Recommendations + Trending contents (horizontal rails).
 */

import type { JSX } from 'react';
import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieListItem, TmdbPagedMoviesResponse, UseQueryResult } from '../../api/types';
import { ShimmerBox } from '../common/ShimmerBox';
import { BrandSolidCtaButton } from '../common/BrandSolidCtaButton';
import { ContentCard } from '../common/ContentCard';
import { RadialGlowBackdrop } from '../common/RadialGlowBackdrop';
import { IconBookmark } from '../common/SimpleIcons';
import { colors, contentCard } from '../../theme/colors';
import { fill, homeRowCardWidth, layout, opacity, radiusCardOuter, radiusFullPill, spacing, tracking } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatListMovieSubtitle } from '../../utils/formatMovieListItem';

/** `watchlist-empty.html` `text-8xl` bookmark (~96px). */
const EMPTY_ICON_SIZE = spacing.xxxxl + spacing.xxl + spacing.sm;
/** Glow canvas behind the bookmark only — keeps highlight off the headline (`watchlist-empty.html`). */
const ICON_RADIAL_GLOW_SIZE = spacing.xxxxl * 4;
const RAIL_MAX_ITEMS = 20;
const RAIL_SKELETON_COUNT = 5;
const railPosterHeight = homeRowCardWidth / contentCard.aspectRatio;

function listItemTitle(item: TmdbMovieListItem): string {
  const t = item.title?.trim() ?? '';
  return t.length > 0 ? t : '—';
}

type WatchlistEmptyRailProps = {
  sectionLabel: string;
  query: UseQueryResult<TmdbPagedMoviesResponse>;
  onPressMovie: (movieId: number) => void;
  /** Extra top margin for the first rail below the hero cluster. */
  marginTopStyle?: StyleProp<ViewStyle>;
};

function WatchlistEmptyRail({
  sectionLabel,
  query,
  onPressMovie,
  marginTopStyle,
}: WatchlistEmptyRailProps): JSX.Element {
  const { data, loading, error, refetch } = query;
  const movies = useMemo(() => (data?.results ?? []).slice(0, RAIL_MAX_ITEMS), [data?.results]);

  return (
    <View style={[styles.railSection, marginTopStyle, loading ? styles.recommendationsGhost : null]}>
      <Text style={styles.sectionLabel}>{sectionLabel}</Text>
      {error != null && !loading ? (
        <View style={styles.railErrorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityLabel={`Retry ${sectionLabel}`}
            accessibilityRole="button"
            onPress={refetch}
            style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
          >
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}
      {loading ? (
        <View style={styles.railSkeletonHost} accessibilityLabel={`Loading ${sectionLabel}`}>
          <ScrollView
            contentContainerStyle={styles.railScrollContent}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.railScrollHost}
          >
            {Array.from({ length: RAIL_SKELETON_COUNT }, (_, i) => (
              <View key={i} style={styles.railSkeletonCard}>
                <ShimmerBox style={styles.railSkeletonPoster} />
                <ShimmerBox style={styles.railSkeletonTitleLine} />
                <ShimmerBox style={styles.railSkeletonSubLine} />
              </View>
            ))}
          </ScrollView>
        </View>
      ) : movies.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.railScrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.railScrollHost}
        >
          {movies.map((movie) => (
            <ContentCard
              key={movie.id}
              onPress={() => {
                onPressMovie(movie.id);
              }}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              showRating={false}
              style={styles.railCard}
              subtitle={formatListMovieSubtitle(movie)}
              title={listItemTitle(movie)}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

export type WatchlistEmptyStateProps = {
  ctaWidth: number;
  popularRecommendations: UseQueryResult<TmdbPagedMoviesResponse>;
  trendingContents: UseQueryResult<TmdbPagedMoviesResponse>;
  onBrowseTrending: () => void;
  onPressRecommendation: (movieId: number) => void;
};

export function WatchlistEmptyState({
  ctaWidth,
  popularRecommendations,
  trendingContents,
  onBrowseTrending,
  onPressRecommendation,
}: WatchlistEmptyStateProps): JSX.Element {
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

      <WatchlistEmptyRail
        marginTopStyle={styles.railFirstMargin}
        onPressMovie={onPressRecommendation}
        query={popularRecommendations}
        sectionLabel="Popular recommendations"
      />
      <WatchlistEmptyRail
        marginTopStyle={styles.railFollowMargin}
        onPressMovie={onPressRecommendation}
        query={trendingContents}
        sectionLabel="Trending contents"
      />
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
    lineHeight: spacing.xl,
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  centerSlot: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: fill.none,
  },
  disc: {
    alignItems: 'center',
    backgroundColor: colors.watchlist_empty_icon_disc,
    borderColor: colors.outline_variant_ring,
    borderRadius: radiusFullPill,
    borderWidth: layout.hairline,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  discIconDim: {
    opacity: opacity.scrim,
  },
  emptyCluster: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
  headline: {
    ...typography['headline-md'],
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
  railCard: {
    marginRight: spacing.xxl,
    width: homeRowCardWidth,
  },
  railErrorBlock: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  railFirstMargin: {
    marginTop: spacing.xxxl * 2,
  },
  railFollowMargin: {
    marginTop: spacing.xxxl * 2,
  },
  railScrollContent: {
    paddingRight: spacing.xxl,
  },
  railScrollHost: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
  },
  railSection: {
    alignSelf: 'stretch',
    width: '100%',
  },
  railSkeletonCard: {
    marginRight: spacing.xxl,
    width: homeRowCardWidth,
  },
  railSkeletonHost: {
    minHeight: railPosterHeight + spacing.sm + layout.skeletonLineSm + spacing.xs + layout.skeletonLineXs,
  },
  railSkeletonPoster: {
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardOuter,
    height: railPosterHeight,
    width: '100%',
  },
  railSkeletonSubLine: {
    borderRadius: spacing.xs,
    height: layout.skeletonLineXs,
    marginTop: spacing.xs,
    width: '70%',
  },
  railSkeletonTitleLine: {
    borderRadius: spacing.xs,
    height: layout.skeletonLineSm,
    marginTop: spacing.sm,
    width: '85%',
  },
  recommendationsGhost: {
    opacity: opacity.ghost,
    pointerEvents: 'none',
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryBtnPressed: {
    opacity: opacity.control,
  },
  retryLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  sectionLabel: {
    ...typography['label-sm'],
    alignSelf: 'stretch',
    color: colors.on_surface_variant,
    letterSpacing: tracking.caps,
    marginBottom: spacing.xl,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
});
