/**
 * “More Like This” — `movie-showDetail.html`: 120×180 posters, **title** only under each poster (no year).
 */

import type { JSX } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieListItem } from '../../api/types';
import { IconMovie } from '../common/SimpleIcons';
import { ShimmerBox } from '../common/ShimmerBox';
import { colors, contentCard } from '../../theme/colors';
import { detailSimilarPosterWidth, layout, opacity, radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W185 } from '../../utils/image';
import { DetailSectionError } from './DetailSectionError';

function listItemTitle(item: TmdbMovieListItem): string {
  const t = item.title?.trim() ?? '';
  return t.length > 0 ? t : '—';
}

export type DetailSimilarSectionProps = {
  loading: boolean;
  error: string | null;
  results: TmdbMovieListItem[] | null;
  onRetry: () => void;
  onPressSeeAll: () => void;
  onPressMovie: (movieId: number) => void;
};

const POSTER_W = detailSimilarPosterWidth;
const POSTER_H = POSTER_W / contentCard.aspectRatio;

export function DetailSimilarSection({
  loading,
  error,
  results,
  onRetry,
  onPressSeeAll,
  onPressMovie,
}: DetailSimilarSectionProps): JSX.Element {
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
              <View key={i} style={styles.cardCell}>
                <ShimmerBox style={[styles.cardPosterShim, { height: POSTER_H, width: POSTER_W }]} />
                <ShimmerBox style={styles.titleShim} />
              </View>
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

  const list = Array.isArray(results) ? results : [];
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
        {list.map((item) => {
          const uri = buildImageUrl(item.poster_path, TMDB_IMAGE_SIZE_W185);
          const title = listItemTitle(item);
          return (
            <Pressable
              key={item.id}
              accessibilityLabel={title}
              accessibilityRole="button"
              onPress={() => {
                onPressMovie(item.id);
              }}
              style={({ pressed }) => [styles.cardCell, pressed && styles.cardPressed]}
            >
              <View style={[styles.posterShell, { height: POSTER_H, width: POSTER_W }]}>
                {uri != null ? (
                  <Image
                    accessibilityIgnoresInvertColors
                    accessibilityLabel={title}
                    resizeMode="cover"
                    source={{ uri }}
                    style={styles.posterImage}
                  />
                ) : (
                  <View style={styles.posterPlaceholder}>
                    <IconMovie color={colors.on_surface_variant} size={32} />
                  </View>
                )}
              </View>
              <Text numberOfLines={2} style={styles.cardTitle}>
                {title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: spacing.xxl,
  },
  cardCell: {
    width: POSTER_W,
  },
  cardPosterShim: {
    borderRadius: radiusCardInner,
    marginBottom: spacing.sm,
  },
  cardPressed: {
    opacity: opacity.emphasis,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  cardTitle: {
    ...typography['detail-similar-title'],
    color: colors.on_surface,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  heading: {
    ...typography['headline-search'],
    color: colors.on_surface,
    fontWeight: '700',
  },
  headingShim: {
    borderRadius: spacing.xs,
    height: layout.skeletonTextLine,
    width: layout.skeletonPosterMd,
  },
  posterImage: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardInner,
  },
  posterPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
  },
  posterShell: {
    borderRadius: radiusCardInner,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  seeAll: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  seeAllLabel: {
    ...typography['label-sm'],
    color: colors.primary,
    fontWeight: '700',
  },
  seeAllPressed: {
    opacity: opacity.control,
  },
  seeAllShim: {
    borderRadius: spacing.xs,
    height: layout.skeletonLineMd,
    width: layout.skeletonThumb,
  },
  titleShim: {
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    height: layout.skeletonLineXs,
    width: POSTER_W * 0.72,
  },
});
