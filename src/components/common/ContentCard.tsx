/**
 * Portrait content card — presentational only (PSD-Home §5, components.mdc).
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, contentCard } from '../../theme/colors';
import { opacity, radiusCardInner, radiusCardOuter, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W185 } from '../../utils/image';
import { showTmdbVoteAverageBadge } from '../../utils/tmdbDisplayGuards';
import { IconMovie } from './SimpleIcons';
import { PosterRatingBadge } from './PosterRatingBadge';

export type ContentCardProps = {
  title: string;
  subtitle: string;
  /** TMDB-style poster path; null/empty shows placeholder (no remote URL). Ignored when `posterUri` is set. */
  posterPath?: string | null | undefined;
  /**
   * Full poster URL (e.g. static marketing assets). When non-empty, used instead of TMDB `posterPath`.
   */
  posterUri?: string | null;
  /** Vote average (e.g. TMDB 0–10). Omit or null to hide the badge. */
  rating?: number | null;
  /**
   * When false, never show the rating pill (e.g. Home horizontal rails — `resources/home.html`).
   * Default true preserves Search / See All / Watchlist / Detail carousels.
   */
  showRating?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function ContentCard({
  title,
  subtitle,
  posterPath,
  posterUri: posterUriProp,
  rating,
  showRating = true,
  onPress,
  style,
  testID,
}: ContentCardProps): JSX.Element {
  const trimmedOverride =
    posterUriProp != null && posterUriProp.trim() !== '' ? posterUriProp.trim() : null;
  const posterUri = trimmedOverride ?? buildImageUrl(posterPath, TMDB_IMAGE_SIZE_W185);
  const positiveRating: number | null =
    showRating &&
    typeof rating === 'number' &&
    showTmdbVoteAverageBadge(rating)
      ? rating
      : null;

  const posterBlock = (
    <View style={styles.posterShell}>
      <View style={styles.posterOuter}>
        <View style={styles.posterFrame}>
        {posterUri != null ? (
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={{ uri: posterUri }}
            style={styles.posterImage}
          />
        ) : (
          <View
            accessibilityLabel="No poster available"
            accessibilityRole="image"
            style={styles.posterPlaceholder}
            testID={testID != null ? `${testID}-placeholder` : undefined}
          >
            <IconMovie color={colors.on_surface_variant} size={32} />
          </View>
        )}
        <PosterRatingBadge density="md" style={styles.ratingBadge} variant="search" voteAverage={positiveRating} />
        </View>
      </View>
    </View>
  );

  const textBlock = (
    <View style={styles.textBlock}>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <Text numberOfLines={2} style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );

  const accessibilityLabel = `${title}. ${subtitle}`;

  if (onPress != null) {
    return (
      <Pressable
        accessibilityHint="Opens details"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
        testID={testID}
      >
        {posterBlock}
        {textBlock}
      </Pressable>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel} style={[styles.card, style]} testID={testID}>
      {posterBlock}
      {textBlock}
    </View>
  );
}

const styles = StyleSheet.create({
  /** Root is transparent; poster uses `surface_container_low` shell (`resources/home.html`). */
  card: {},
  cardPressed: {
    opacity: opacity.emphasis,
  },
  posterShell: {
    width: '100%',
  },
  posterOuter: {
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
    width: '100%',
  },
  posterFrame: {
    aspectRatio: contentCard.aspectRatio,
    borderRadius: radiusCardInner,
    overflow: 'hidden',
    width: '100%',
  },
  posterImage: {
    height: '100%',
    width: '100%',
  },
  posterPlaceholder: {
    alignItems: 'center',
    /** PSD-Detail §3 — align with hero null-media treatment (`surface_container_high` + icon). */
    backgroundColor: colors.surface_container_high,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
  textBlock: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  subtitle: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
});
