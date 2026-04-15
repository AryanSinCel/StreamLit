/**
 * “Because you saved …” horizontal similar row — `resources/watchlist.html` (View All + landscape tiles).
 */

import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbGenre, TmdbMovieListItem } from '../../api/types';
import { colors } from '../../theme/colors';
import { spacing, watchlistSimilarRailCardWidth } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { WatchlistSimilarLandscapeCard } from './WatchlistSimilarLandscapeCard';

export type WatchlistBecauseYouSavedSectionProps = {
  savedTitle: string;
  movies: readonly TmdbMovieListItem[];
  genres: readonly TmdbGenre[];
  onPressSeeAll: () => void;
  onPressMovie: (movieId: number) => void;
};

export function WatchlistBecauseYouSavedSection({
  savedTitle,
  movies,
  genres,
  onPressSeeAll,
  onPressMovie,
}: WatchlistBecauseYouSavedSectionProps): JSX.Element {
  const headline = `Because you saved ${savedTitle}`;

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Text accessibilityRole="header" numberOfLines={2} style={styles.headline}>
          {headline}
        </Text>
        <Pressable
          accessibilityHint="Opens full similar list"
          accessibilityLabel="View all similar titles"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onPressSeeAll}
          style={({ pressed }) => [styles.seeAllHit, pressed && styles.seeAllPressed]}
        >
          <Text style={styles.seeAllLabel}>View All</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.carousel}
        showsHorizontalScrollIndicator={false}
      >
        {movies.map((item) => (
          <WatchlistSimilarLandscapeCard
            key={item.id}
            genres={genres}
            item={item}
            onPress={() => {
              onPressMovie(item.id);
            }}
            style={styles.cardSpacing}
            width={watchlistSimilarRailCardWidth}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSpacing: {
    marginRight: spacing.md,
  },
  carousel: {
    paddingVertical: spacing.xs,
  },
  headline: {
    ...typography['title-lg'],
    color: colors.on_surface,
    flex: 1,
  },
  seeAllHit: {
    paddingVertical: spacing.xs,
  },
  seeAllLabel: {
    ...typography['label-sm'],
    color: colors.primary,
    fontWeight: '700',
  },
  seeAllPressed: {
    opacity: 0.88,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  wrap: {
    gap: spacing.md,
    marginBottom: spacing.xl,
    marginTop: spacing.xxl,
  },
});
