/**
 * Search tab default (idle) body — PSD-Search §3; trending skeleton on first load (§7 S6).
 */

import type { JSX } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { SearchScreenMode, TmdbGenre, TmdbMovieListItem } from '../../api/types';
import { IconMovie, IconSearch } from '../common/SimpleIcons';
import { PosterRatingBadge } from '../common/PosterRatingBadge';
import { colors, contentCard } from '../../theme/colors';
import {
  radiusCardInner,
  radiusCardOuter,
  radiusFullPill,
  spacing,
  searchFeaturedHeroAspectRatio,
} from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatSearchFeaturedMeta, formatSearchTrendingGenreOnly } from '../../utils/formatMovieListItem';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';
import { SEARCH_INPUT_PLACEHOLDER } from './searchDefaultMocks';
import { SearchRecentSearchesSection } from './SearchRecentSearchesSection';
import { SearchTrendingSkeleton } from './SearchTrendingSkeleton';

const SEARCH_FEATURED_GRADIENT_ID = 'searchFeaturedScrim';

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
  /** TMDB `/genre/movie/list` — featured + mini-card subtitles (`search.html`). */
  genres: readonly TmdbGenre[];
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
  genres,
  gridMovies,
  trendingLoading,
  trendingError,
  onRetryTrending,
}: SearchDefaultViewProps): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  /** Must match `gridRow` gap so two columns + gutter fit inside padded width (flexWrap otherwise stacks one per row). */
  const gridRowGap = spacing.xl;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridRowGap) / 2;

  const showTrending = mode === 'default';
  const featuredUri = featuredBackdropUri(featuredMovie);
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
            <SearchTrendingSkeleton />
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
                  <View style={styles.featuredGradientHost} pointerEvents="none">
                    <Svg
                      height="100%"
                      preserveAspectRatio="none"
                      style={StyleSheet.absoluteFill}
                      width="100%"
                    >
                      <Defs>
                        <LinearGradient
                          gradientUnits="objectBoundingBox"
                          id={SEARCH_FEATURED_GRADIENT_ID}
                          x1="0"
                          x2="0"
                          y1="1"
                          y2="0"
                        >
                          <Stop offset="0" stopColor={colors.surface_container_lowest} stopOpacity="1" />
                          <Stop offset="0.42" stopColor={colors.surface_container_lowest} stopOpacity="0.4" />
                          <Stop offset="0.65" stopColor={colors.surface_container_lowest} stopOpacity="0" />
                          <Stop offset="1" stopColor={colors.surface_container_lowest} stopOpacity="0" />
                        </LinearGradient>
                      </Defs>
                      <Rect
                        fill={`url(#${SEARCH_FEATURED_GRADIENT_ID})`}
                        height="100%"
                        width="100%"
                        x="0"
                        y="0"
                      />
                    </Svg>
                  </View>
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
                      {featuredMovie != null ? formatSearchFeaturedMeta(featuredMovie, genres) : ''}
                    </Text>
                  </View>
                </View>
              </View>

              {gridMovies.length > 0 ? (
                <View style={[styles.gridRow, { gap: gridRowGap }]}>
                  {gridMovies.map((movie) => (
                    <View key={movie.id} style={[styles.gridCell, { width: gridColWidth }]}>
                      <TrendingMiniCard genres={genres} movie={movie} />
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

function TrendingMiniCard({
  movie,
  genres,
}: {
  movie: TmdbMovieListItem;
  genres: readonly TmdbGenre[];
}): JSX.Element {
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
        <PosterRatingBadge density="sm" style={styles.ratingBadge} variant="search" voteAverage={movie.vote_average} />
      </View>
      <Text numberOfLines={1} style={styles.miniTitle}>
        {movie.title.length > 0 ? movie.title : '—'}
      </Text>
      <Text numberOfLines={1} style={styles.miniSubtitle}>
        {formatSearchTrendingGenreOnly(movie, genres)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    width: '100%',
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
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    borderRadius: spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featuredBadgeLabel: {
    ...typography['hero-badge'],
    color: colors.on_primary_container,
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
  featuredGradientHost: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  featuredMeta: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  featuredPosterPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    justifyContent: 'center',
  },
  featuredTextBlock: {
    bottom: 0,
    left: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  featuredTitle: {
    ...typography['headline-rail'],
    color: colors.on_surface,
    fontWeight: '800',
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
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    ...typography['title-search-card'],
    color: colors.on_surface,
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
  sectionLast: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography['headline-search'],
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
});
