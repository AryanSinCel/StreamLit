/**
 * Watchlist zero-items body — PSD-Watchlist §5 (bookmark, copy, CTA, popular row / skeleton / error).
 */

import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type {
  TmdbMovieListItem,
  TmdbPagedMoviesResponse,
  UseQueryResult,
} from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { IconBookmark } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { homeRowCardWidth, radiusCardOuter, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { WatchlistBrowseTrendingCta } from './WatchlistBrowseTrendingCta';
import { WatchlistPopularSkeleton } from './WatchlistPopularSkeleton';

export type WatchlistEmptyStateProps = {
  ctaWidth: number;
  popularRecommendations: UseQueryResult<TmdbPagedMoviesResponse>;
  onBrowseTrending: () => void;
  onOpenTrendingMovie: (movieId: number) => void;
};

function yearFromListItem(item: TmdbMovieListItem): string {
  const d = item.release_date;
  if (d != null && d.length >= 4) {
    return d.slice(0, 4);
  }
  return '—';
}

export function WatchlistEmptyState({
  ctaWidth,
  popularRecommendations,
  onBrowseTrending,
  onOpenTrendingMovie,
}: WatchlistEmptyStateProps): JSX.Element {
  const { data, loading, error, refetch } = popularRecommendations;
  const results = data?.results ?? [];

  return (
    <View style={styles.block}>
      <View style={styles.iconCircle} accessibilityRole="image" accessibilityLabel="Empty watchlist">
        <IconBookmark color={colors.on_surface} size={56} />
      </View>
      <Text style={styles.headline}>Your watchlist is empty</Text>
      <Text style={styles.body}>
        Save titles you want to watch later. Browse trending picks on Home to get started.
      </Text>
      <WatchlistBrowseTrendingCta onPress={onBrowseTrending} width={ctaWidth} />
      <Text style={styles.sectionLabel}>POPULAR RECOMMENDATIONS</Text>
      {loading && data == null ? <WatchlistPopularSkeleton /> : null}
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
      {!loading && error == null && results.length > 0 ? (
        <ScrollView
          horizontal
          contentContainerStyle={styles.carouselContent}
          showsHorizontalScrollIndicator={false}
        >
          {results.map((item) => (
            <ContentCard
              key={item.id}
              onPress={() => {
                onOpenTrendingMovie(item.id);
              }}
              posterPath={item.poster_path}
              rating={item.vote_average}
              style={styles.carouselCard}
              subtitle={yearFromListItem(item)}
              title={item.title}
            />
          ))}
        </ScrollView>
      ) : null}
      {!loading && error == null && results.length === 0 && data != null ? (
        <Text style={styles.muted}>No recommendations right now.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.secondary_container,
    borderRadius: radiusCardOuter + spacing.lg,
    height: spacing.xxxxl + spacing.xxxl,
    justifyContent: 'center',
    marginTop: spacing.md,
    width: spacing.xxxxl + spacing.xxxl,
  },
  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    textAlign: 'center',
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
  },
  sectionLabel: {
    ...typography['label-sm'],
    alignSelf: 'flex-start',
    color: colors.on_surface_variant,
    letterSpacing: 1.2,
    marginTop: spacing.lg,
    textTransform: 'uppercase',
  },
  carouselContent: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  carouselCard: {
    width: homeRowCardWidth,
  },
  errorBlock: {
    alignSelf: 'stretch',
    gap: spacing.md,
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
  muted: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
});
