/**
 * Section title + See All + horizontal poster strip (PSD-Home §5).
 */

import type { JSX } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { TmdbMovieListItem } from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { colors } from '../../theme/colors';
import { homeRowCardWidth, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatListMovieSubtitle } from '../../utils/formatMovieListItem';

export type HomeContentRowProps = {
  sectionTitle: string;
  items: readonly TmdbMovieListItem[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onSeeAll: () => void;
  onOpenDetail: (movieId: number) => void;
};

export function HomeContentRow({
  sectionTitle,
  items,
  loading,
  error,
  onRetry,
  onSeeAll,
  onOpenDetail,
}: HomeContentRowProps): JSX.Element {
  const showInitialSpinner = loading && items.length === 0;
  const showEmpty = !loading && !error && items.length === 0;

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <Pressable accessibilityLabel={`See all ${sectionTitle}`} accessibilityRole="button" onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      {error != null ? (
        <View style={styles.messageBlock}>
          <Text style={styles.errorText}>{error}</Text>
          {onRetry != null ? (
            <Pressable
              accessibilityLabel={`Retry ${sectionTitle}`}
              accessibilityRole="button"
              onPress={onRetry}
              style={({ pressed }) => [styles.retryBtn, pressed && styles.retryPressed]}
            >
              <Text style={styles.retryLabel}>Try again</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {showInitialSpinner ? (
        <View style={styles.centerRow}>
          <ActivityIndicator accessibilityLabel={`Loading ${sectionTitle}`} color={colors.primary} />
        </View>
      ) : null}

      {showEmpty ? (
        <Text style={styles.emptyText}>No movies in this list.</Text>
      ) : null}

      {!error && !showInitialSpinner && items.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.rowScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rowScrollHost}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              onPress={() => {
                onOpenDetail(item.id);
              }}
              posterPath={item.poster_path}
              rating={item.vote_average}
              style={styles.card}
              subtitle={formatListMovieSubtitle(item)}
              title={item.title}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.xxxxl,
  },
  card: {
    marginRight: spacing.xxl,
    width: homeRowCardWidth,
  },
  centerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    paddingHorizontal: spacing.xxl,
  },
  emptyText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.primary_container,
    marginBottom: spacing.sm,
  },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  messageBlock: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.md,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  retryPressed: {
    opacity: 0.88,
  },
  rowScroll: {
    paddingHorizontal: spacing.xxl,
  },
  rowScrollHost: {
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    flex: 1,
    marginRight: spacing.md,
  },
  seeAll: {
    ...typography['title-sm'],
    color: colors.on_surface_variant,
    fontWeight: '600',
  },
});
