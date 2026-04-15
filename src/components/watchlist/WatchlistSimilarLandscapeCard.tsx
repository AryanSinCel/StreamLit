/**
 * Landscape backdrop tile for Watchlist “Because you saved …” rail — `resources/watchlist.html`.
 */

import type { JSX } from 'react';
import { useId } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { TmdbGenre, TmdbMovieListItem } from '../../api/types';
import { IconMovie } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { radiusCardOuter, searchFeaturedHeroAspectRatio, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';
import { formatWatchlistSimilarRailGenreLine } from '../../utils/formatWatchlistGridSubtitle';

const RAIL_GRADIENT_PREFIX = 'watchlistRailScrim-';

export type WatchlistSimilarLandscapeCardProps = {
  item: TmdbMovieListItem;
  genres: readonly TmdbGenre[];
  width: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function WatchlistSimilarLandscapeCard({
  item,
  genres,
  width,
  onPress,
  style,
}: WatchlistSimilarLandscapeCardProps): JSX.Element {
  const reactId = useId();
  const gradId = `${RAIL_GRADIENT_PREFIX}${reactId.replace(/:/g, '')}`;
  const w = Math.max(1, width);
  const h = w / searchFeaturedHeroAspectRatio;
  const backdropUri =
    buildImageUrl(item.backdrop_path, TMDB_IMAGE_SIZE_W780) ??
    buildImageUrl(item.poster_path, TMDB_IMAGE_SIZE_W780) ??
    buildImageUrl(item.poster_path, TMDB_IMAGE_SIZE_W342);
  const title = item.title.trim().length > 0 ? item.title : '—';
  const genreLine = formatWatchlistSimilarRailGenreLine(item, genres);

  return (
    <Pressable
      accessibilityHint="Opens movie details"
      accessibilityLabel={`${title}. ${genreLine}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      <View style={[styles.shell, { borderRadius: radiusCardOuter, height: h, width: w }]}>
        {backdropUri != null ? (
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel={title}
            resizeMode="cover"
            source={{ uri: backdropUri }}
            style={[styles.image, { borderRadius: radiusCardOuter }]}
          />
        ) : (
          <View style={[styles.placeholder, { borderRadius: radiusCardOuter }]}>
            <IconMovie color={colors.on_surface_variant} size={40} />
          </View>
        )}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg height="100%" preserveAspectRatio="none" style={StyleSheet.absoluteFill} width="100%">
            <Defs>
              <LinearGradient
                gradientUnits="objectBoundingBox"
                id={gradId}
                x1="0"
                x2="0"
                y1="1"
                y2="0"
              >
                <Stop offset="0" stopColor={colors.surface_container_lowest} stopOpacity="1" />
                <Stop offset="0.45" stopColor={colors.surface_container_lowest} stopOpacity="0.55" />
                <Stop offset="0.78" stopColor={colors.surface_container_lowest} stopOpacity="0" />
                <Stop offset="1" stopColor={colors.surface_container_lowest} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect fill={`url(#${gradId})`} height="100%" width="100%" x="0" y="0" />
          </Svg>
        </View>
        <View style={styles.textBlock} pointerEvents="none">
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.genreLine}>
            {genreLine}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  genreLine: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_high,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.92,
  },
  shell: {
    overflow: 'hidden',
    position: 'relative',
  },
  textBlock: {
    bottom: 0,
    left: 0,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    position: 'absolute',
    right: 0,
  },
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
    fontWeight: '700',
  },
});
