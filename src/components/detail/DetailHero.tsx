/**
 * Detail hero — full-bleed backdrop, bottom scrim (`movie-showDetail.html` `.hero-gradient`).
 */

import type { JSX } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { TmdbMovieDetail } from '../../api/types';
import { IconMovie } from '../common/SimpleIcons';
import { colors, surfaceRgba } from '../../theme/colors';
import { detailHeroHeight, fill } from '../../theme/spacing';
import { buildImageUrl, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';

const HERO_GRADIENT_HEIGHT_RATIO = 0.4;

export type DetailHeroProps = {
  width: number;
  movie: TmdbMovieDetail | null;
};

export function DetailHero({ width, movie }: DetailHeroProps): JSX.Element {
  const w = Math.max(1, width);
  const backdropUri =
    buildImageUrl(movie?.backdrop_path, TMDB_IMAGE_SIZE_W780) ??
    buildImageUrl(movie?.poster_path, TMDB_IMAGE_SIZE_W780);
  const gradientH = Math.round(detailHeroHeight * HERO_GRADIENT_HEIGHT_RATIO);

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
      <View style={[styles.scrimWrap, { height: gradientH, width: w }]} pointerEvents="none">
        <LinearGradient
          colors={[surfaceRgba(0), surfaceRgba(1)]}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
          start={{ x: 0.5, y: 0 }}
          style={{ height: gradientH, width: w }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_high,
    justifyContent: 'center',
  },
  scrimWrap: {
    bottom: fill.none,
    left: fill.none,
    position: 'absolute',
  },
  shell: {
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
});
