/**
 * Watchlist grid cell — Stitch layout (`watchlist.png`): unified shell, poster, `p-4` body,
 * title + Material close, year · dot · genres, Details CTA (`surface-container-highest` + border).
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TmdbGenre, WatchlistItem } from '../../api/types';
import { IconClose, IconMovie } from '../common/SimpleIcons';
import { PosterRatingBadge } from '../common/PosterRatingBadge';
import { colors, contentCard } from '../../theme/colors';
import { elevation, layout, opacity, radiusCardOuter, radiusFullPill, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatWatchlistGridMetaParts } from '../../utils/formatWatchlistGridSubtitle';
import { buildImageUrl, TMDB_IMAGE_SIZE_W342 } from '../../utils/image';

export type WatchlistGridCardProps = {
  item: WatchlistItem;
  genres: readonly TmdbGenre[];
  style?: StyleProp<ViewStyle>;
  onPressDetails: () => void;
  detailsEnabled: boolean;
  onPressRemove: () => void;
};

export function WatchlistGridCard({
  item,
  genres,
  style,
  onPressDetails,
  detailsEnabled,
  onPressRemove,
}: WatchlistGridCardProps): JSX.Element {
  const uri = buildImageUrl(item.posterPath, TMDB_IMAGE_SIZE_W342);
  const { year, genreLine } = formatWatchlistGridMetaParts(item, genres);

  return (
    <View style={[styles.cardShell, style]} accessibilityLabel={item.title}>
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
        <PosterRatingBadge density="md" style={styles.ratingBadge} variant="watchlist" voteAverage={item.voteAverage} />
      </View>
      <View style={styles.cardBody}>
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
            style={({ pressed }) => [styles.closeHit, pressed && styles.closeHitPressed]}
          >
            <IconClose color={colors.on_surface_variant} size={40} />
          </Pressable>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{year}</Text>
          <View style={styles.metaDot} />
          <Text numberOfLines={2} style={[styles.metaText, styles.metaGenres]}>
            {genreLine}
          </Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  cardBody: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  cardShell: {
    backgroundColor: colors.surface_container_high,
    borderRadius: radiusCardOuter,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  closeHit: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    width: 40,
  },
  closeHitPressed: {
    opacity: opacity.control,
  },
  detailsBtn: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.surface_container_highest,
    borderColor: colors.watchlist_details_cta_border,
    borderRadius: spacing.sm,
    borderWidth: layout.hairline,
    marginTop: 'auto',
    paddingVertical: spacing.sm,
  },
  detailsBtnDisabled: {
    opacity: opacity.faint,
  },
  detailsBtnPressed: {
    opacity: opacity.emphasis,
  },
  detailsLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '700',
  },
  detailsLabelDisabled: {
    color: colors.on_surface_variant,
  },
  metaDot: {
    backgroundColor: colors.outline_variant,
    borderRadius: radiusFullPill,
    height: spacing.xs,
    width: spacing.xs,
  },
  metaGenres: {
    flex: 1,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaText: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  poster: {
    aspectRatio: contentCard.aspectRatio,
    backgroundColor: colors.surface_container_low,
    borderTopLeftRadius: radiusCardOuter,
    borderTopRightRadius: radiusCardOuter,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  posterImage: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: radiusCardOuter,
    borderTopRightRadius: radiusCardOuter,
  },
  posterPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderTopLeftRadius: radiusCardOuter,
    borderTopRightRadius: radiusCardOuter,
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    zIndex: elevation.card,
  },
  title: {
    ...typography['watchlist-card-title'],
    color: colors.on_surface,
    flex: 1,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
});
