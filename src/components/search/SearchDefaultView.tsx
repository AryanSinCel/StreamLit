/**
 * Search tab default (idle) body — PSD-Search §3; wired to `useSearch` data in S4b (no results grid).
 */

import type { JSX } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import type { SearchScreenMode, TmdbMovieListItem } from '../../api/types';
import { IconHistory, IconMovie, IconSearch, IconStar } from '../common/SimpleIcons';
import { colors, contentCard } from '../../theme/colors';
import {
  radiusCardInner,
  radiusCardOuter,
  radiusFullPill,
  spacing,
  searchFeaturedHeroAspectRatio,
} from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatListMovieSubtitle } from '../../utils/formatMovieListItem';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';
import { SEARCH_INPUT_PLACEHOLDER } from './searchDefaultMocks';

export type SearchDefaultViewProps = {
  query: string;
  onChangeQuery: (value: string) => void;
  inputFocused: boolean;
  onFocusInput: () => void;
  onBlurInput: () => void;
  genreChipLabels: readonly string[];
  selectedGenreIndex: number | null;
  onGenreChipPress: (label: string) => void;
  recentSearches: readonly string[];
  onClearRecents: () => void;
  onRecentTermPress: (term: string) => void;
  showRecentsBlock: boolean;
  mode: SearchScreenMode;
  featuredMovie: TmdbMovieListItem | null;
  gridMovies: readonly TmdbMovieListItem[];
  trendingLoading: boolean;
  trendingError: string | null;
  onRetryTrending: () => void;
};

function featuredBackdropUri(movie: TmdbMovieListItem | null): string | null {
  if (movie == null) {
    return null;
  }
  return (
    buildImageUrl(movie.backdrop_path, TMDB_IMAGE_SIZE_W780) ??
    buildImageUrl(movie.poster_path, TMDB_IMAGE_SIZE_W780)
  );
}

function ratingShort(vote: number): string {
  if (typeof vote !== 'number' || Number.isNaN(vote) || !Number.isFinite(vote)) {
    return '—';
  }
  return vote.toFixed(1);
}

export function SearchDefaultView({
  query,
  onChangeQuery,
  inputFocused,
  onFocusInput,
  onBlurInput,
  genreChipLabels,
  selectedGenreIndex,
  onGenreChipPress,
  recentSearches,
  onClearRecents,
  onRecentTermPress,
  showRecentsBlock,
  mode,
  featuredMovie,
  gridMovies,
  trendingLoading,
  trendingError,
  onRetryTrending,
}: SearchDefaultViewProps): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  const gridGutter = spacing.md;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridGutter) / 2;

  const showTrending = mode === 'default';
  const featuredUri = featuredBackdropUri(featuredMovie);
  const row1 = gridMovies.slice(0, 2);
  const row2 = gridMovies.slice(2, 3);

  return (
    <View style={styles.body}>
      <View style={styles.searchRow}>
        <View style={styles.searchIconWrap} pointerEvents="none">
          <IconSearch color={colors.on_surface_variant} size={22} />
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

      {showRecentsBlock ? (
        <View style={styles.section}>
          <View style={styles.recentHeaderRow}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all recent searches"
              hitSlop={spacing.sm}
              onPress={onClearRecents}
            >
              <Text style={styles.clearAll}>Clear All</Text>
            </Pressable>
          </View>
          <View style={styles.recentList}>
            {recentSearches.map((term, index) => (
              <Pressable
                accessibilityRole="button"
                key={`${term}-${String(index)}`}
                onPress={() => onRecentTermPress(term)}
                style={({ pressed }) => [styles.recentRow, pressed && styles.recentRowPressed]}
              >
                <View style={styles.recentLeft}>
                  <IconHistory color={colors.on_surface_variant} size={22} />
                  <Text style={styles.recentTerm}>{term}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {showTrending ? (
        <View style={styles.sectionLast}>
          <Text style={styles.sectionTitle}>Trending Now</Text>

          {trendingError != null ? (
            <View style={styles.trendingErrorBlock}>
              <Text style={styles.trendingErrorText}>{trendingError}</Text>
              <Pressable
                accessibilityLabel="Retry loading trending"
                accessibilityRole="button"
                onPress={onRetryTrending}
                style={({ pressed }) => [styles.retryBtn, pressed && styles.chipPressed]}
              >
                <Text style={styles.retryBtnLabel}>Try again</Text>
              </Pressable>
            </View>
          ) : null}

          {trendingError == null && trendingLoading && featuredMovie == null ? (
            <View style={styles.trendingLoadingBlock}>
              <ActivityIndicator accessibilityLabel="Loading trending" color={colors.on_surface_variant} />
              <Text style={styles.trendingLoadingText}>Loading trending…</Text>
            </View>
          ) : null}

          {trendingError == null && !(trendingLoading && featuredMovie == null) ? (
            <>
              <View style={styles.featuredWrap}>
                <View style={styles.featuredCard}>
                  {featuredUri != null ? (
                    <Image
                      accessibilityIgnoresInvertColors
                      accessibilityLabel={featuredMovie?.title ?? 'Featured movie'}
                      resizeMode="cover"
                      source={{ uri: featuredUri }}
                      style={styles.featuredImage}
                    />
                  ) : (
                    <View style={styles.featuredPosterPlaceholder}>
                      <IconMovie color={colors.on_surface_variant} size={56} />
                    </View>
                  )}
                  <View style={styles.featuredScrim} pointerEvents="none" />
                  <View style={styles.featuredTextBlock}>
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeLabel}>Featured</Text>
                    </View>
                    <Text style={styles.featuredTitle}>
                      {featuredMovie?.title != null && featuredMovie.title.length > 0
                        ? featuredMovie.title
                        : '—'}
                    </Text>
                    <Text style={styles.featuredMeta}>
                      {featuredMovie != null ? formatListMovieSubtitle(featuredMovie) : ''}
                    </Text>
                  </View>
                </View>
              </View>

              {row1.length > 0 ? (
                <View style={styles.gridRow}>
                  {row1.map((movie) => (
                    <View key={movie.id} style={[styles.gridCell, { width: gridColWidth }]}>
                      <TrendingMiniCard movie={movie} />
                    </View>
                  ))}
                </View>
              ) : null}
              {row2.length > 0 ? (
                <View style={styles.gridRow}>
                  {row2.map((movie) => (
                    <View key={movie.id} style={[styles.gridCell, { width: gridColWidth }]}>
                      <TrendingMiniCard movie={movie} />
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function TrendingMiniCard({ movie }: { movie: TmdbMovieListItem }): JSX.Element {
  const uri = buildImageUrl(movie.poster_path, TMDB_IMAGE_SIZE_W342);
  return (
    <View style={styles.miniCard}>
      <View style={styles.miniPoster}>
        {uri != null ? (
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel={movie.title}
            resizeMode="cover"
            source={{ uri }}
            style={styles.miniPosterImage}
          />
        ) : (
          <View style={styles.miniPosterInner}>
            <IconMovie color={colors.on_surface_variant} size={40} />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingValue}>{ratingShort(movie.vote_average)}</Text>
          <IconStar color={colors.primary_container} size={12} />
        </View>
      </View>
      <Text numberOfLines={1} style={styles.miniTitle}>
        {movie.title.length > 0 ? movie.title : '—'}
      </Text>
      <Text numberOfLines={1} style={styles.miniSubtitle}>
        {formatListMovieSubtitle(movie)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
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
  clearAll: {
    ...typography['title-sm'],
    color: colors.primary_container,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary_container,
    borderRadius: spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featuredBadgeLabel: {
    ...typography['tab-label'],
    color: colors.on_surface,
    letterSpacing: 2.5,
  },
  featuredCard: {
    aspectRatio: searchFeaturedHeroAspectRatio,
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  featuredImage: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardOuter,
  },
  featuredMeta: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  featuredPosterPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    justifyContent: 'center',
  },
  featuredScrim: {
    backgroundColor: colors.surface_container_lowest,
    bottom: 0,
    left: 0,
    opacity: 0.88,
    position: 'absolute',
    right: 0,
    top: '40%',
  },
  featuredTextBlock: {
    bottom: 0,
    left: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    position: 'absolute',
    right: 0,
  },
  featuredTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 6,
  },
  featuredWrap: {
    alignSelf: 'stretch',
    marginBottom: spacing.xl,
    width: '100%',
  },
  gridCell: {
    marginBottom: spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'flex-start',
  },
  miniCard: {
    gap: spacing.md,
  },
  miniPoster: {
    aspectRatio: contentCard.aspectRatio,
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  miniPosterImage: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardOuter,
  },
  miniPosterInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    margin: spacing.xs,
  },
  miniSubtitle: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  miniTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  ratingBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
  ratingValue: {
    ...typography['tab-label'],
    color: colors.on_surface,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'none',
  },
  recentHeaderRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  recentLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  recentList: {
    gap: spacing.xs,
  },
  recentRow: {
    borderRadius: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  recentRowPressed: {
    opacity: 0.88,
  },
  recentTerm: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  recentTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
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
    left: spacing.md,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: spacing.xxl,
    zIndex: 1,
  },
  searchInput: {
    ...typography['body-md'],
    backgroundColor: colors.surface_container_low,
    borderColor: 'transparent',
    borderRadius: spacing.md,
    borderWidth: 2,
    color: colors.on_surface,
    flex: 1,
    minHeight: spacing.xxxxl,
    paddingLeft: spacing.xxxxl + spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.md,
  },
  searchInputFocused: {
    borderColor: colors.outline_variant,
  },
  searchRow: {
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionLast: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: spacing.xl,
  },
  trendingErrorBlock: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  trendingErrorText: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
  trendingLoadingBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  trendingLoadingText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
});
