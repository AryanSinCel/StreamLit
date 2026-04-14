/**
 * Portrait content card — presentational only (PSD-Home §5, components.mdc).
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, contentCard } from '../../theme/colors';
import { radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W185 } from '../../utils/image';
import { IconStar } from './SimpleIcons';

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
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function formatRating(value: number): string {
  if (value >= 10) {
    return '10';
  }
  return value.toFixed(1);
}

export function ContentCard({
  title,
  subtitle,
  posterPath,
  posterUri: posterUriProp,
  rating,
  onPress,
  style,
  testID,
}: ContentCardProps): JSX.Element {
  const trimmedOverride =
    posterUriProp != null && posterUriProp.trim() !== '' ? posterUriProp.trim() : null;
  const posterUri = trimmedOverride ?? buildImageUrl(posterPath, TMDB_IMAGE_SIZE_W185);
  const showRating =
    typeof rating === 'number' && !Number.isNaN(rating) && Number.isFinite(rating);

  const posterBlock = (
    <View style={styles.posterShell}>
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
          />
        )}
        {showRating ? (
          <View style={styles.ratingBadge} accessibilityLabel={`Rating ${formatRating(rating)} out of 10`}>
            <IconStar color={colors.primary_container} size={12} />
            <Text style={styles.ratingValue}>{formatRating(rating)}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const textBlock = (
    <View style={styles.textBlock}>
      <Text numberOfLines={2} style={styles.title}>
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
  /** No panel background — poster + text sit on parent surface (`resources/home.html`). */
  card: {},
  cardPressed: {
    opacity: 0.92,
  },
  posterShell: {
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
    /** Matches row image wrapper in `home.html` (`surface-container-low`). */
    backgroundColor: colors.surface_container_low,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
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
    ...typography['label-sm'],
    color: colors.on_surface,
  },
  textBlock: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  subtitle: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
});
