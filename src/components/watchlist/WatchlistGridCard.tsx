/**
 * Watchlist grid cell — poster, rating badge, remove (parent-controlled), Details CTA (PSD-Watchlist §3).
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { WatchlistItem } from '../../api/types';
import { IconMovie, IconStar } from '../common/SimpleIcons';
import { colors, contentCard } from '../../theme/colors';
import { radiusCardInner, radiusCardOuter, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342 } from '../../utils/image';

export type WatchlistGridCardProps = {
  item: WatchlistItem;
  style?: StyleProp<ViewStyle>;
  onPressDetails: () => void;
  detailsEnabled: boolean;
  onPressRemove: () => void;
};

function formatRating(value: number): string {
  if (value >= 10) {
    return '10';
  }
  return value.toFixed(1);
}

function yearFromReleaseDate(releaseDate: string): string {
  if (releaseDate.length >= 4) {
    return releaseDate.slice(0, 4);
  }
  return '—';
}

function buildSubtitle(item: WatchlistItem): string {
  const year = yearFromReleaseDate(item.releaseDate);
  const kind = item.mediaType === 'movie' ? 'Movie' : 'Series';
  return `${year} · ${kind}`;
}

export function WatchlistGridCard({
  item,
  style,
  onPressDetails,
  detailsEnabled,
  onPressRemove,
}: WatchlistGridCardProps): JSX.Element {
  const uri = buildImageUrl(item.posterPath, TMDB_IMAGE_SIZE_W342);
  const showRating =
    typeof item.voteAverage === 'number' &&
    !Number.isNaN(item.voteAverage) &&
    Number.isFinite(item.voteAverage);

  return (
    <View style={[styles.root, style]} accessibilityLabel={item.title}>
      <View style={styles.poster}>
        {uri != null ? (
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel={item.title}
            resizeMode="cover"
            source={{ uri }}
            style={styles.posterImage}
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <IconMovie color={colors.on_surface_variant} size={40} />
          </View>
        )}
        <Pressable
          accessibilityHint="Removes this title from your watchlist"
          accessibilityLabel="Remove from watchlist"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onPressRemove}
          style={({ pressed }) => [styles.removeBtn, pressed && styles.removeBtnPressed]}
        >
          <Text style={styles.removeGlyph}>×</Text>
        </Pressable>
        {showRating ? (
          <View
            style={styles.ratingBadge}
            accessibilityLabel={`Rating ${formatRating(item.voteAverage)} out of 10`}
          >
            <IconStar color={colors.primary_container} size={12} />
            <Text style={styles.ratingValue}>{formatRating(item.voteAverage)}</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {item.title}
      </Text>
      <Text numberOfLines={2} style={styles.subtitle}>
        {buildSubtitle(item)}
      </Text>
      <Pressable
        accessibilityHint={
          detailsEnabled ? 'Opens movie details' : 'Details available for movies only'
        }
        accessibilityLabel="Details"
        accessibilityRole="button"
        accessibilityState={{ disabled: !detailsEnabled }}
        disabled={!detailsEnabled}
        onPress={onPressDetails}
        style={({ pressed }) => [
          styles.detailsBtn,
          !detailsEnabled && styles.detailsBtnDisabled,
          pressed && detailsEnabled && styles.detailsBtnPressed,
        ]}
      >
        <Text style={[styles.detailsLabel, !detailsEnabled && styles.detailsLabelDisabled]}>
          Details
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  poster: {
    aspectRatio: contentCard.aspectRatio,
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  posterImage: {
    ...StyleSheet.absoluteFill,
    borderRadius: radiusCardOuter,
  },
  posterPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    margin: spacing.xs,
  },
  removeBtn: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: radiusCardInner,
    height: spacing.xl + spacing.sm,
    justifyContent: 'center',
    left: spacing.sm,
    position: 'absolute',
    top: spacing.sm,
    width: spacing.xl + spacing.sm,
  },
  removeBtnPressed: {
    opacity: 0.88,
  },
  removeGlyph: {
    ...typography['title-lg'],
    color: colors.on_surface,
    lineHeight: 24,
    marginTop: -spacing.xs,
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
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  subtitle: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  detailsBtn: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.surface_container_high,
    borderRadius: radiusCardInner,
    paddingVertical: spacing.sm,
  },
  detailsBtnDisabled: {
    opacity: 0.45,
  },
  detailsBtnPressed: {
    opacity: 0.88,
  },
  detailsLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  detailsLabelDisabled: {
    color: colors.on_surface_variant,
  },
});
