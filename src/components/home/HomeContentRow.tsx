/**
 * Section title + See All + horizontal poster strip (PSD-Home §5, H5 pagination).
 */

import type { JSX } from 'react';
import { useCallback, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbGenre, TmdbMovieListItem } from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { ShimmerBox } from '../common/ShimmerBox';
import { colors } from '../../theme/colors';
import { homeRowCardWidth, radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatHomeRailSubtitle } from '../../utils/formatMovieListItem';
import { HomeRowSkeleton } from './HomeRowSkeleton';

/** PSD H5: trigger next page when viewport is within this many cards of the row end. */
const NEAR_END_CARD_COUNT = 3;

/** Throttle rapid `onScroll` bursts so we do not double-request the same page. */
const NEAR_END_THROTTLE_MS = 450;

const nearEndThresholdPx = NEAR_END_CARD_COUNT * (homeRowCardWidth + spacing.xxl);

/** `genre` — discover-driven rows (empty copy + retry tuned for filters). */
export type HomeRowContentKind = 'default' | 'genre';

export type HomeContentRowProps = {
  sectionTitle: string;
  /** TMDB genre list — resolves `genre_ids` to the metadata line (`Year · Genre`). */
  genres: readonly TmdbGenre[];
  items: readonly TmdbMovieListItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onRetry?: () => void;
  onSeeAll: () => void;
  onOpenDetail: (movieId: number) => void;
  /** Called when the horizontal list is scrolled within {@link NEAR_END_CARD_COUNT} items of the end. */
  onNearEnd?: () => void;
  /** Discover / genre rows use dedicated empty UI (PSD-Home H6). */
  rowContent?: HomeRowContentKind;
  /**
   * Genre rail under **All**: not yet in viewport — show horizontal skeleton instead of empty-state copy.
   */
  awaitingLazyLoad?: boolean;
  /**
   * When true (genre row on Home **All**), keep the real section header on first-page fetch and show
   * {@link HomeRowSkeleton} under it until results arrive (no full-row title shimmer).
   */
  suppressInitialHorizontalSkeleton?: boolean;
  /**
   * When the parent shows the vertical “Loading more content” footer for the genre chain, hide this
   * row’s title / See All / body until the first page arrives (they appear together with posters).
   */
  omitBodySkeletonForVerticalChainLoad?: boolean;
};

export function HomeContentRow({
  sectionTitle,
  genres,
  items,
  loading,
  loadingMore,
  hasMore,
  error,
  onRetry,
  onSeeAll,
  onOpenDetail,
  onNearEnd,
  rowContent = 'default',
  awaitingLazyLoad = false,
  suppressInitialHorizontalSkeleton = false,
  omitBodySkeletonForVerticalChainLoad = false,
}: HomeContentRowProps): JSX.Element {
  const showSkeleton =
    loading && items.length === 0 && !(suppressInitialHorizontalSkeleton && rowContent === 'genre');
  const genreInitialBodyLoading =
    rowContent === 'genre' &&
    suppressInitialHorizontalSkeleton &&
    loading &&
    items.length === 0 &&
    error == null;
  const showGenreInitialBodySkeleton =
    genreInitialBodyLoading && !omitBodySkeletonForVerticalChainLoad;
  const hideRailChromeForVerticalChainLoad =
    genreInitialBodyLoading && omitBodySkeletonForVerticalChainLoad;
  const showLazyPlaceholder =
    rowContent === 'genre' &&
    awaitingLazyLoad &&
    !loading &&
    error == null &&
    items.length === 0;
  /** Never overlap empty copy with skeleton / lazy placeholder / pagination fetch. */
  const showEmpty =
    !loading &&
    !loadingMore &&
    !error &&
    items.length === 0 &&
    !(rowContent === 'genre' && awaitingLazyLoad) &&
    !showSkeleton &&
    !showLazyPlaceholder;
  const lastNearEndFireRef = useRef(0);
  const scrollHostWidthRef = useRef(0);

  const fireNearEndIfAllowed = useCallback(() => {
    if (
      error != null ||
      !hasMore ||
      loading ||
      loadingMore ||
      items.length === 0 ||
      onNearEnd == null
    ) {
      return;
    }
    const now = Date.now();
    if (now - lastNearEndFireRef.current < NEAR_END_THROTTLE_MS) {
      return;
    }
    lastNearEndFireRef.current = now;
    onNearEnd();
  }, [error, hasMore, loading, loadingMore, items.length, onNearEnd]);

  const handleHorizontalScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (
        error != null ||
        !hasMore ||
        loading ||
        loadingMore ||
        items.length === 0 ||
        onNearEnd == null
      ) {
        return;
      }
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const scrollable = contentSize.width > layoutMeasurement.width;
      const distanceFromEnd = contentSize.width - layoutMeasurement.width - contentOffset.x;
      /** When the row does not overflow horizontally, treat as “at end” so pagination still runs. */
      const nearHorizontalEnd = !scrollable || distanceFromEnd <= nearEndThresholdPx;
      if (nearHorizontalEnd) {
        fireNearEndIfAllowed();
      }
    },
    [fireNearEndIfAllowed],
  );

  const handleRowContentSizeChange = useCallback(
    (contentWidth: number) => {
      if (scrollHostWidthRef.current < 32) {
        return;
      }
      if (contentWidth <= scrollHostWidthRef.current + 1) {
        fireNearEndIfAllowed();
      }
    },
    [fireNearEndIfAllowed],
  );

  return (
    <View style={[styles.block, hideRailChromeForVerticalChainLoad && styles.blockRailChromeHidden]}>
      {!hideRailChromeForVerticalChainLoad ? (
        <View style={styles.header}>
          {showSkeleton && !showLazyPlaceholder ? (
            <>
              <ShimmerBox style={styles.skeletonSectionTitle} />
              <ShimmerBox style={styles.skeletonSeeAll} />
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              <Pressable accessibilityLabel={`See all ${sectionTitle}`} accessibilityRole="button" onPress={onSeeAll}>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : null}

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

      {showSkeleton || showLazyPlaceholder || showGenreInitialBodySkeleton ? (
        <HomeRowSkeleton />
      ) : null}

      {showEmpty ? (
        rowContent === 'genre' ? (
          <View style={styles.emptyGenrePanel}>
            <Text style={styles.emptyGenreTitle}>No movies in this category</Text>
            <Text style={styles.emptyGenreBody}>
              We could not find anything for this filter. Try another chip or refresh the list.
            </Text>
            {onRetry != null ? (
              <Pressable
                accessibilityLabel={`Refresh ${sectionTitle}`}
                accessibilityRole="button"
                onPress={onRetry}
                style={({ pressed }) => [styles.retryBtn, pressed && styles.retryPressed]}
              >
                <Text style={styles.retryLabel}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <Text style={styles.emptyText}>No movies in this list.</Text>
        )
      ) : null}

      {!error && !showSkeleton && !showLazyPlaceholder && items.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.rowScroll}
          horizontal
          onContentSizeChange={handleRowContentSizeChange}
          onLayout={(e) => {
            scrollHostWidthRef.current = e.nativeEvent.layout.width;
          }}
          onScroll={handleHorizontalScroll}
          scrollEventThrottle={16}
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
              showRating={false}
              style={styles.card}
              subtitle={formatHomeRailSubtitle(item, genres)}
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
  blockRailChromeHidden: {
    marginBottom: 0,
  },
  card: {
    marginRight: spacing.xxl,
    width: homeRowCardWidth,
  },
  emptyGenreBody: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
  emptyGenrePanel: {
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardInner,
    gap: spacing.md,
    marginHorizontal: spacing.xxl,
    padding: spacing.xl,
  },
  emptyGenreTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
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
    ...typography['headline-rail'],
    color: colors.on_surface,
    flex: 1,
    marginRight: spacing.md,
  },
  seeAll: {
    ...typography['title-sm'],
    color: colors.on_surface_variant,
    fontWeight: '600',
  },
  skeletonSectionTitle: {
    borderRadius: spacing.xs,
    flex: 1,
    height: 24,
    marginRight: spacing.md,
    maxWidth: 220,
  },
  skeletonSeeAll: {
    borderRadius: spacing.xs,
    height: 16,
    width: 64,
  },
});
