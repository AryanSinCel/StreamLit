/**
 * Detail hero — backdrop via `image.ts`, bottom scrim, null media → placeholder + MovieList icon (PSD-Detail §3–4).
 */

import type { JSX } from 'react';
import { useId } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { TmdbMovieDetail } from '../../api/types';
import { IconMovie } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { detailHeroHeight, radiusCardInner } from '../../theme/spacing';
import { buildImageUrl, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';

const HERO_GRADIENT_HEIGHT_RATIO = 0.4;

export type DetailHeroProps = {
  width: number;
  movie: TmdbMovieDetail | null;
};

export function DetailHero({ width, movie }: DetailHeroProps): JSX.Element {
  const reactId = useId();
  const gradId = `detailHeroScrim-${reactId.replace(/:/g, '')}`;
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
        <Svg height={gradientH} width={w}>
          <Defs>
            <LinearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor={colors.surface} stopOpacity="0" />
              <Stop offset="1" stopColor={colors.surface} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect fill={`url(#${gradId})`} height={gradientH} width={w} x={0} y={0} />
        </Svg>
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
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  shell: {
    alignSelf: 'center',
    borderRadius: radiusCardInner,
    overflow: 'hidden',
  },
});
