/**
 * Featured hero — TMDB backdrop + CTAs (PSD-Home §5; `resources/home.html`).
 */

import type { JSX } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { TmdbMovieListItem } from '../../api/types';
import { IconPlay } from '../common/SimpleIcons';
import { HomeHeroSkeleton } from './HomeHeroSkeleton';
import { colors } from '../../theme/colors';
import { homeHeroHeight, radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W780 } from '../../utils/image';

const HERO_SCRIM_GRADIENT_ID = 'homeHeroScrim';

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
  if (loading && movie == null) {
    return <HomeHeroSkeleton />;
  }

  const backdropUri = heroBackdropUri(movie);
  const canAct = movie != null && !loading;

  return (
    <View style={styles.wrap}>
      <View style={styles.shell}>
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
        <View style={styles.scrimHost} pointerEvents="none">
          <Svg height="100%" preserveAspectRatio="none" style={StyleSheet.absoluteFill} width="100%">
            <Defs>
              <LinearGradient
                gradientUnits="objectBoundingBox"
                id={HERO_SCRIM_GRADIENT_ID}
                x1="0"
                x2="0"
                y1="1"
                y2="0"
              >
                <Stop offset="0" stopColor={colors.surface} stopOpacity="1" />
                <Stop offset="0.42" stopColor={colors.surface} stopOpacity="0.35" />
                <Stop offset="0.62" stopColor={colors.surface} stopOpacity="0" />
                <Stop offset="1" stopColor={colors.surface} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect fill={`url(#${HERO_SCRIM_GRADIENT_ID})`} height="100%" width="100%" x="0" y="0" />
          </Svg>
        </View>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New Release</Text>
          </View>
          <Text style={styles.title}>{movie?.title ?? 'Featured'}</Text>
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
              <IconPlay color={colors.on_primary} size={20} />
              <Text style={styles.watchLabel}>Watch Now</Text>
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
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: spacing.md,
    marginTop: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    opacity: 0.6,
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
  content: {
    bottom: 0,
    justifyContent: 'flex-end',
    left: 0,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xxxl,
    position: 'absolute',
    right: 0,
  },
  detailsBtn: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.md,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  detailsLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '700',
  },
  pressedDisabled: {
    opacity: 0.5,
  },
  scrimHost: {
    ...StyleSheet.absoluteFill,
  },
  shell: {
    borderRadius: radiusCardInner,
    height: homeHeroHeight,
    overflow: 'hidden',
    width: '100%',
  },
  synopsis: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginBottom: spacing.xxl,
    maxWidth: 320,
    minHeight: 40,
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: spacing.xs, width: 0 },
    textShadowRadius: spacing.md,
  },
  title: {
    ...typography['display-md'],
    color: colors.on_surface,
    marginBottom: spacing.lg,
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: spacing.xs, width: 0 },
    textShadowRadius: spacing.md,
    textTransform: 'uppercase',
  },
  watchBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  watchLabel: {
    ...typography['title-sm'],
    color: colors.on_primary,
    fontWeight: '700',
  },
  wrap: {
    marginBottom: spacing.xxxxl,
    paddingHorizontal: spacing.xxl,
  },
});
