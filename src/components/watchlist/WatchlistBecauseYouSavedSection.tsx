/**
 * “Because you saved …” horizontal similar row — PSD-Watchlist §3 / §7 W5.
 */

import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieListItem } from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { colors } from '../../theme/colors';
import { homeRowCardWidth, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

function yearFromListItem(item: TmdbMovieListItem): string {
  const d = item.release_date;
  if (d != null && d.length >= 4) {
    return d.slice(0, 4);
  }
  return '—';
}

export type WatchlistBecauseYouSavedSectionProps = {
  savedTitle: string;
  movies: readonly TmdbMovieListItem[];
  onPressSeeAll: () => void;
  onPressMovie: (movieId: number) => void;
};

export function WatchlistBecauseYouSavedSection({
  savedTitle,
  movies,
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
          accessibilityLabel="See all similar titles"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onPressSeeAll}
          style={({ pressed }) => [styles.seeAllHit, pressed && styles.seeAllPressed]}
        >
          <Text style={styles.seeAllLabel}>See All</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.carousel}
        showsHorizontalScrollIndicator={false}
      >
        {movies.map((item) => (
          <ContentCard
            key={item.id}
            onPress={() => {
              onPressMovie(item.id);
            }}
            posterPath={item.poster_path}
            rating={item.vote_average}
            style={styles.card}
            subtitle={yearFromListItem(item)}
            title={item.title}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headline: {
    ...typography['title-lg'],
    color: colors.on_surface,
    flex: 1,
  },
  seeAllHit: {
    paddingVertical: spacing.xs,
  },
  seeAllPressed: {
    opacity: 0.88,
  },
  seeAllLabel: {
    ...typography['label-sm'],
    color: colors.primary_container,
    fontWeight: '700',
  },
  carousel: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  card: {
    width: homeRowCardWidth,
  },
});
