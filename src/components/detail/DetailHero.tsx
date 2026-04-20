/**
 * Detail hero — full-bleed backdrop (same still dim as `HomeHero`), full-frame scrim
 * (`movie-showDetail.html` `.hero-gradient`: inset-0).
 */

import type { JSX } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { TmdbMovieDetail } from '../../api/types';
import { IconMovie } from '../common/SimpleIcons';
import { colors, surfaceRgba } from '../../theme/colors';
import { detailHeroHeight, opacity } from '../../theme/spacing';
import { buildImageUrl, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';

export type DetailHeroProps = {
  width: number;
  movie: TmdbMovieDetail | null;
};

export function DetailHero({ width, movie }: DetailHeroProps): JSX.Element {
  const w = Math.max(1, width);
  const backdropUri =
    buildImageUrl(movie?.backdrop_path, TMDB_IMAGE_SIZE_W780) ??
    buildImageUrl(movie?.poster_path, TMDB_IMAGE_SIZE_W780);

  return (
    <View style={[styles.shell, { height: detailHeroHeight, width: w }]}>
      {backdropUri != null ? (
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel="Movie backdrop"
          resizeMode="cover"
          source={{ uri: backdropUri }}
          style={styles.backdrop}
        />
      ) : (
        <View accessibilityLabel="No backdrop available" accessibilityRole="image" style={styles.placeholder}>
          <IconMovie color={colors.on_surface_variant} size={48} />
        </View>
      )}
      <LinearGradient
        colors={[surfaceRgba(0), surfaceRgba(1)]}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={[styles.heroGradient, { width: w }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    opacity: opacity.muted,
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_high,
    justifyContent: 'center',
  },
  shell: {
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
});
