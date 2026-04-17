/**
 * PSD Search §4 State 2 (results) — count line, 2-column poster grid, zero-results, loading/error.
 * Loading uses shape-matched skeleton (§7 S6). Presentational: parent supplies `useSearch` + navigation.
 */

import type { JSX } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import type { TmdbSearchMovieListItem } from '../../api/types';
import { LoadMoreContentIndicator } from '../common/LoadMoreContentIndicator';
import { IconMovie, IconSearch } from '../common/SimpleIcons';
import { PosterRatingBadge } from '../common/PosterRatingBadge';
import { colors, contentCard } from '../../theme/colors';
import {
  radiusCardInner,
  radiusCardOuter,
  radiusFullPill,
  spacing,
  tracking,
} from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342 } from '../../utils/image';
import { SEARCH_INPUT_PLACEHOLDER } from './searchDefaultMocks';
import { SearchRecentSearchesSection } from './SearchRecentSearchesSection';
import { SearchResultsGridSkeleton } from './SearchResultsGridSkeleton';

export type SearchResultsStateViewProps = {
  query: string;
  onChangeQuery: (value: string) => void;
  inputFocused: boolean;
  onFocusInput: () => void;
  onBlurInput: () => void;
  genreChipLabels: readonly string[];
  selectedGenreIndex: number | null;
  onGenreChipPress: (label: string) => void;
  showRecentsBlock: boolean;
  recentSearches: readonly string[];
  onClearRecents: () => void;
  onRecentTermPress: (term: string) => void;
  debouncedQuery: string;
  totalResults: number;
  results: readonly TmdbSearchMovieListItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onRetrySearch: () => void;
  onOpenResult: (movieId: number) => void;
};

function listItemTitle(item: TmdbSearchMovieListItem): string {
  const t = item.title?.trim() ?? '';
  if (t.length > 0) {
    return t;
  }
  const o = item.original_title?.trim() ?? '';
  if (o.length > 0) {
    return o;
  }
  return '—';
}

function listItemYear(item: TmdbSearchMovieListItem): string {
  const d = item.release_date;
  if (d != null && d.length >= 4) {
    return d.slice(0, 4);
  }
  return '—';
}

export function SearchResultsStateView({
  query,
  onChangeQuery,
  inputFocused,
  onFocusInput,
  onBlurInput,
  genreChipLabels,
  selectedGenreIndex,
  onGenreChipPress,
  showRecentsBlock,
  recentSearches,
  onClearRecents,
  onRecentTermPress,
  debouncedQuery,
  totalResults,
  results,
  loading,
  loadingMore,
  hasMore,
  error,
  onRetrySearch,
  onOpenResult,
}: SearchResultsStateViewProps): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  /** Must match `gridRow` gap so two columns + gutter fit inside padded width. */
  const gridRowGap = spacing.xxl;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridRowGap) / 2;

  const pairs: TmdbSearchMovieListItem[][] = [];
  for (let i = 0; i < results.length; i += 2) {
    pairs.push(results.slice(i, i + 2));
  }

  const showGrid = !loading && error == null && results.length > 0;
  const showEmpty = !loading && error == null && results.length === 0;
  const showCount = showGrid;

  return (
    <View style={styles.body}>
      <View style={styles.searchRow}>
        <View style={styles.searchIconWrap} pointerEvents="none">
          <IconSearch color={colors.on_surface_variant} size={24} />
        </View>
        <TextInput
          accessibilityLabel="Search movies, actors, directors"
          autoCapitalize="none"
          autoCorrect={false}
          onBlur={onBlurInput}
          onChangeText={onChangeQuery}
          onFocus={onFocusInput}
          placeholder={SEARCH_INPUT_PLACEHOLDER}
          placeholderTextColor={colors.search_placeholder}
          style={[styles.searchInput, inputFocused && styles.searchInputFocused]}
          value={query}
        />
      </View>

      <View style={styles.section}>
        <ScrollView
          contentContainerStyle={styles.chipsScrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {genreChipLabels.map((label, index) => {
            const selected = selectedGenreIndex !== null && index === selectedGenreIndex;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={label}
                onPress={() => onGenreChipPress(label)}
                style={({ pressed }) => [
                  styles.chip,
                  selected ? styles.chipSelected : styles.chipIdle,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={[styles.chipLabel, selected ? styles.chipLabelSelected : styles.chipLabelIdle]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <SearchRecentSearchesSection
        onClearRecents={onClearRecents}
        onRecentTermPress={onRecentTermPress}
        recentSearches={recentSearches}
        visible={showRecentsBlock}
      />

      {error != null ? (
        <View style={styles.messageBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityLabel="Retry search"
            accessibilityRole="button"
            onPress={onRetrySearch}
            style={({ pressed }) => [styles.retryBtn, pressed && styles.chipPressed]}
          >
            <Text style={styles.retryBtnLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {error == null && loading ? <SearchResultsGridSkeleton /> : null}

      {showCount ? (
        <Text style={styles.countLine}>
          {totalResults.toLocaleString()} results for &apos;{debouncedQuery}&apos;
        </Text>
      ) : null}

      {showGrid ? (
        <View style={styles.grid}>
          {pairs.map((row) => (
            <View key={row.map((m) => String(m.id)).join('|')} style={[styles.gridRow, { gap: gridRowGap }]}>
              {row.map((item) => (
                <View key={String(item.id)} style={{ width: gridColWidth }}>
                  <SearchResultGridCard item={item} onPress={() => onOpenResult(item.id)} />
                </View>
              ))}
            </View>
          ))}
          <LoadMoreContentIndicator active={hasMore && loadingMore} style={styles.searchLoadMore} />
        </View>
      ) : null}

      {showEmpty ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconCircle}>
            <IconSearch color={colors.on_surface_variant} size={44} />
          </View>
          <Text style={styles.emptyTitle}>
            No results for &apos;{debouncedQuery}&apos;
          </Text>
          <Text style={styles.emptyBody}>
            Try a different title or check your spelling. You can also clear the search bar to browse
            trending picks.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function SearchResultGridCard({
  item,
  onPress,
}: {
  item: TmdbSearchMovieListItem;
  onPress: () => void;
}): JSX.Element {
  const title = listItemTitle(item);
  const year = listItemYear(item);
  const uri = buildImageUrl(item.poster_path, TMDB_IMAGE_SIZE_W342);
  return (
    <Pressable
      accessibilityHint="Opens movie details"
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.poster}>
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
            <IconMovie color={colors.on_surface_variant} size={40} />
          </View>
        )}
        <PosterRatingBadge density="sm" style={styles.ratingBadge} variant="search" voteAverage={item.vote_average} />
      </View>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {title}
      </Text>
      <Text numberOfLines={1} style={styles.cardYear}>
        {year}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    flexGrow: 1,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    width: '100%',
  },
  card: {
    gap: spacing.md,
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardTitle: {
    ...typography['title-search-card'],
    color: colors.on_surface,
  },
  cardYear: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  chip: {
    borderRadius: radiusFullPill,
    marginRight: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + spacing.xs,
  },
  chipIdle: {
    backgroundColor: colors.surface_container_highest,
  },
  chipLabel: {
    ...typography['title-sm'],
    fontWeight: '600',
  },
  chipLabelIdle: {
    color: colors.on_surface_variant,
  },
  chipLabelSelected: {
    color: colors.on_surface,
    fontWeight: '600',
  },
  chipPressed: {
    opacity: 0.88,
  },
  chipSelected: {
    backgroundColor: colors.secondary_container,
  },
  chipsScrollContent: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    paddingRight: spacing.xl,
  },
  countLine: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    fontWeight: '500',
    letterSpacing: tracking.wide05,
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyBody: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyIconCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardOuter,
    height: spacing.xxxxl + spacing.lg,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    width: spacing.xxxxl + spacing.lg,
  },
  emptyTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    textAlign: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.md,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
  grid: {
    gap: spacing.xxl,
  },
  searchLoadMore: {
    marginTop: spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  messageBlock: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  poster: {
    aspectRatio: contentCard.aspectRatio,
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  posterImage: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardOuter,
  },
  posterPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    margin: spacing.xs,
  },
  ratingBadge: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    zIndex: 2,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryBtnLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  searchIconWrap: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: spacing.lg,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: spacing.xxxl + spacing.sm,
    zIndex: 1,
  },
  searchInput: {
    ...typography['search-input-value'],
    backgroundColor: colors.surface_container_low,
    borderColor: 'transparent',
    borderRadius: spacing.md,
    borderWidth: 2,
    color: colors.on_surface,
    flex: 1,
    minHeight: spacing.xxxxl,
    paddingLeft: spacing.xxxl + spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.lg,
  },
  searchInputFocused: {
    borderColor: colors.search_input_focus_ring,
  },
  searchRow: {
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  section: {
    marginBottom: spacing.xxxl,
  },
});
