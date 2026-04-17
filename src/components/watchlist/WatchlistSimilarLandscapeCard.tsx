/**
 * Landscape backdrop tile for Watchlist “Because you saved …” rail — `resources/watchlist.html`.
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { TmdbGenre, TmdbMovieListItem } from '../../api/types';
import { IconMovie } from '../common/SimpleIcons';
import { colors, surfaceContainerLowestRgba } from '../../theme/colors';
import {
  radiusCardOuter,
  searchFeaturedHeroAspectRatio,
  spacing,
  tracking,
} from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';
import { formatWatchlistSimilarRailGenreLine } from '../../utils/formatWatchlistGridSubtitle';

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
        <LinearGradient
          colors={[
            surfaceContainerLowestRgba(1),
            surfaceContainerLowestRgba(0.55),
            surfaceContainerLowestRgba(0),
            surfaceContainerLowestRgba(0),
          ]}
          end={{ x: 0.5, y: 0 }}
          locations={[0, 0.45, 0.78, 1]}
          pointerEvents="none"
          start={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
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
    letterSpacing: tracking.railUpper,
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
