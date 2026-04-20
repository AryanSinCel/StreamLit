/**
 * Featured hero — TMDB backdrop + CTAs (PSD-Home §5; `resources/home.html`).
 */

import type { JSX } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { TmdbMovieListItem } from '../../api/types';
import { IconPlay } from '../common/SimpleIcons';
import { HomeHeroSkeleton } from './HomeHeroSkeleton';
import { colors, surfaceRgba } from '../../theme/colors';
import {
  fill,
  homeHeroHeight,
  homeHeroWidthRatio,
  layout,
  opacity,
  radiusCardOuter,
  spacing,
} from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';

export type HomeHeroProps = {
  movie: TmdbMovieListItem | null;
  loading: boolean;
  onWatchNow: () => void;
  onDetails: () => void;
};

function synopsisForHero(movie: TmdbMovieListItem | null): string {
  if (movie == null) {
    return '';
  }
  const trimmed = movie.overview?.trim();
  if (trimmed != null && trimmed.length > 0) {
    return trimmed;
  }
  const year =
    movie.release_date != null && movie.release_date.length >= 4
      ? movie.release_date.slice(0, 4)
      : '—';
  const rating =
    typeof movie.vote_average === 'number' &&
    !Number.isNaN(movie.vote_average) &&
    Number.isFinite(movie.vote_average)
      ? movie.vote_average.toFixed(1)
      : '—';
  return `Trending pick · ${year} · ${rating}`;
}

function heroBackdropUri(movie: TmdbMovieListItem | null): string | null {
  if (movie == null) {
    return null;
  }
  return (
    buildImageUrl(movie.backdrop_path, TMDB_IMAGE_SIZE_W780) ??
    buildImageUrl(movie.poster_path, TMDB_IMAGE_SIZE_W780)
  );
}

export function HomeHero({ movie, loading, onWatchNow, onDetails }: HomeHeroProps): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const heroWidth = Math.max(1, Math.round(windowWidth * homeHeroWidthRatio));

  if (loading && movie == null) {
    return <HomeHeroSkeleton />;
  }

  const backdropUri = heroBackdropUri(movie);
  const canAct = movie != null && !loading;

  return (
    <View style={styles.wrap}>
      <View style={[styles.shell, { width: heroWidth }]}>
        {backdropUri != null ? (
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel="Featured title backdrop"
            resizeMode="cover"
            source={{ uri: backdropUri }}
            style={styles.backdrop}
          />
        ) : (
          <View style={styles.backdropPlaceholder} accessibilityLabel="Featured backdrop placeholder" />
        )}
        <LinearGradient
          colors={[surfaceRgba(1), surfaceRgba(0.35), surfaceRgba(0), surfaceRgba(0)]}
          end={{ x: 0.5, y: 0 }}
          locations={[0, 0.42, 0.62, 1]}
          pointerEvents="none"
          start={{ x: 0.5, y: 1 }}
          style={styles.scrimHost}
        />
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New Release</Text>
          </View>
          <Text style={styles.title}>{movie?.title ?? 'Featured'}</Text>
          <View style={styles.synopsisColumn}>
            <Text numberOfLines={2} style={styles.synopsis}>
              {synopsisForHero(movie)}
            </Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityLabel="Watch now"
                accessibilityRole="button"
                disabled={!canAct}
                onPress={onWatchNow}
                style={({ pressed }) => [
                  styles.watchBtn,
                  (!canAct || pressed) && styles.pressedDisabled,
                ]}
              >
                <View style={styles.watchBtnInner}>
                  <IconPlay color={colors.on_primary} size={20} />
                  <Text style={styles.watchLabel}>Watch Now</Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityLabel="Details"
                accessibilityRole="button"
                disabled={!canAct}
                onPress={onDetails}
                style={({ pressed }) => [
                  styles.detailsBtn,
                  (!canAct || pressed) && styles.pressedDisabled,
                ]}
              >
                <Text style={styles.detailsLabel}>Details</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * Same width as synopsis (`max-w-md`); `space-between` pins **Details** to the column’s
   * right edge — no extra gap past synopsis like a left-packed row.
   */
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginTop: fill.none,
    width: '100%',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    opacity: opacity.muted,
  },
  backdropPlaceholder: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.surface_container_low,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    borderRadius: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography['hero-badge'],
    color: colors.on_primary_container,
  },
  /**
   * Fill the card vertically so `justifyContent: 'flex-end'` actually pins the stack to the
   * bottom (`home.html` / `home.png`). Inset matches `bottom-10 left-10` (40px).
   */
  content: {
    alignItems: 'flex-start',
    bottom: fill.none,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    left: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    position: 'absolute',
    right: spacing.md,
    top: fill.none,
  },
  detailsBtn: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.md,
    flexDirection: 'row',
    flexGrow: fill.none,
    flexShrink: fill.none,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  detailsLabel: {
    ...typography['home-hero-cta'],
    color: colors.on_surface,
  },
  pressedDisabled: {
    opacity: opacity.scrim,
  },
  scrimHost: {
    ...StyleSheet.absoluteFill,
  },
  shell: {
    alignSelf: 'center',
    borderRadius: radiusCardOuter,
    height: homeHeroHeight,
    overflow: 'hidden',
  },
  synopsis: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginBottom: spacing.xxl,
    textAlign: 'left',
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: spacing.xs, width: fill.none },
    textShadowRadius: spacing.md,
  },
  /** `home.html` `max-w-md` — synopsis + CTAs share this column width. */
  synopsisColumn: {
    alignSelf: 'flex-start',
    maxWidth: layout.contentMaxMd,
    width: '100%',
  },
  title: {
    ...typography['display-md'],
    alignSelf: 'stretch',
    color: colors.on_surface,
    marginBottom: spacing.lg,
    textAlign: 'left',
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: spacing.xs, width: fill.none },
    textShadowRadius: spacing.md,
    textTransform: 'uppercase',
  },
  watchBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    flexGrow: fill.none,
    flexShrink: fill.none,
    overflow: 'hidden',
  },
  watchBtnInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  watchLabel: {
    ...typography['home-hero-cta'],
    color: colors.on_primary,
  },
  wrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: spacing.xxxxl,
  },
});
