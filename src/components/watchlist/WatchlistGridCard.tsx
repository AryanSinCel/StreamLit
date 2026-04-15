/**
 * Watchlist grid cell — poster + scrim rating, title row + remove, year · genres, Details CTA (`resources/watchlist.html`).
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TmdbGenre, WatchlistItem } from '../../api/types';
import { IconMovie, IconStar } from '../common/SimpleIcons';
import { colors, contentCard } from '../../theme/colors';
import { radiusCardInner, radiusCardOuter, radiusFullPill, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatWatchlistGridSubtitle } from '../../utils/formatWatchlistGridSubtitle';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342 } from '../../utils/image';

export type WatchlistGridCardProps = {
  item: WatchlistItem;
  genres: readonly TmdbGenre[];
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

export function WatchlistGridCard({
  item,
  genres,
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
        {showRating ? (
          <View
            style={styles.ratingBadge}
            accessibilityLabel={`Rating ${formatRating(item.voteAverage)} out of 10`}
          >
            <IconStar color={colors.primary} size={12} />
            <Text style={styles.ratingValue}>{formatRating(item.voteAverage)}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.titleRow}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Pressable
          accessibilityHint="Removes this title from your watchlist"
          accessibilityLabel="Remove from watchlist"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onPressRemove}
          style={({ pressed }) => [styles.removeChip, pressed && styles.removeChipPressed]}
        >
          <Text style={styles.removeGlyph}>×</Text>
        </Pressable>
      </View>
      <Text numberOfLines={2} style={styles.subtitle}>
        {formatWatchlistGridSubtitle(item, genres)}
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
  ratingBadge: {
    alignItems: 'center',
    backgroundColor: colors.poster_rating_scrim,
    borderRadius: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    zIndex: 2,
  },
  ratingValue: {
    ...typography['label-sm'],
    color: colors.on_surface,
  },
  removeChip: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: radiusFullPill,
    height: spacing.xl,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    width: spacing.xl,
  },
  removeChipPressed: {
    opacity: 0.88,
  },
  removeGlyph: {
    ...typography['title-sm'],
    color: colors.on_surface,
    lineHeight: 20,
    marginTop: -2,
  },
  root: {
    gap: spacing.sm,
  },
  subtitle: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
    flex: 1,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 0,
    justifyContent: 'space-between',
  },
});
