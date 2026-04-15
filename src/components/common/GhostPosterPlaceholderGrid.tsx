/**
 * Muted 2:3 poster placeholders — `resources/watchlist-empty.html` recommendation ghosts.
 */

import type { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, contentCard } from '../../theme/colors';
import { radiusCardOuter, spacing } from '../../theme/spacing';

export type GhostPosterPlaceholderGridProps = {
  /** Portrait tile width (two tiles + `gap` should fit the content width). */
  posterWidth: number;
  count?: number;
  gap?: number;
};

export function GhostPosterPlaceholderGrid({
  posterWidth,
  count = 2,
  gap = spacing.xl,
}: GhostPosterPlaceholderGridProps): JSX.Element {
  const safeCount = Math.max(1, count);
  const w = Math.max(1, posterWidth);
  const slots = Array.from({ length: safeCount }, (_, i) => i);
  const posterHeight = w / contentCard.aspectRatio;

  return (
    <View style={[styles.row, { gap }]}>
      {slots.map((i) => (
        <View
          key={i}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.tile, { height: posterHeight, width: w }]}
        >
          <View style={styles.poster} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
  },
  poster: {
    backgroundColor: colors.surface_container_highest,
    flex: 1,
  },
});
