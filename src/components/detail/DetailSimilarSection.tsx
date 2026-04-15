/**
 * “More Like This” — binds to **`similar`** hook section (PSD-Detail §2.1–2.2, §3–4).
 * Hidden when `results` is empty after a successful load.
 */

import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieListItem } from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { ShimmerBox } from '../common/ShimmerBox';
import { colors, contentCard } from '../../theme/colors';
import { homeRowCardWidth, radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { DetailSectionError } from './DetailSectionError';

function yearFromListItem(item: TmdbMovieListItem): string {
  const d = item.release_date;
  if (d != null && d.length >= 4) {
    return d.slice(0, 4);
  }
  return '—';
}

export type DetailSimilarSectionProps = {
  loading: boolean;
  error: string | null;
  results: TmdbMovieListItem[] | null;
  onRetry: () => void;
  onPressSeeAll: () => void;
  onPressMovie: (movieId: number) => void;
};

export function DetailSimilarSection({
  loading,
  error,
  results,
  onRetry,
  onPressSeeAll,
  onPressMovie,
}: DetailSimilarSectionProps): JSX.Element {
  const posterH = homeRowCardWidth / contentCard.aspectRatio;

  if (loading && results == null) {
    return (
      <View style={styles.block}>
        <View style={styles.headerRow}>
          <ShimmerBox style={styles.headingShim} />
          <ShimmerBox style={styles.seeAllShim} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.cardRow}>
            {Array.from({ length: 4 }, (_, i) => (
              <ShimmerBox key={i} style={[styles.cardShim, { height: posterH, width: homeRowCardWidth }]} />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error != null) {
    return (
      <View style={styles.block}>
        <Text style={styles.heading}>More Like This</Text>
        <DetailSectionError
          message={error}
          onRetry={onRetry}
          retryAccessibilityLabel="Retry loading similar titles"
        />
      </View>
    );
  }

  const list = results ?? [];
  if (list.length === 0) {
    return <View />;
  }

  return (
    <View style={styles.block}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>More Like This</Text>
        <Pressable
          accessibilityLabel="See all similar titles"
          accessibilityRole="button"
          onPress={onPressSeeAll}
          style={({ pressed }) => [styles.seeAll, pressed && styles.seeAllPressed]}
        >
          <Text style={styles.seeAllLabel}>See All</Text>
        </Pressable>
      </View>
      <ScrollView horizontal contentContainerStyle={styles.cardRow} showsHorizontalScrollIndicator={false}>
        {list.map((item) => (
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
  block: {
    marginTop: spacing.xl,
  },
  card: {
    width: homeRowCardWidth,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  cardShim: {
    borderRadius: radiusCardInner,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  heading: {
    ...typography['headline-md'],
    color: colors.on_surface,
  },
  headingShim: {
    borderRadius: spacing.xs,
    height: 28,
    width: 160,
  },
  seeAll: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  seeAllLabel: {
    ...typography['label-sm'],
    color: colors.primary_container,
    fontWeight: '600',
  },
  seeAllPressed: {
    opacity: 0.88,
  },
  seeAllShim: {
    borderRadius: spacing.xs,
    height: 20,
    width: 56,
  },
});
