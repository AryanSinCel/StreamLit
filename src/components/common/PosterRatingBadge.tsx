/**
 * Poster-corner TMDB rating — `resources/search.html` (search variant) vs `resources/watchlist.html` (watchlist variant).
 * Scrim: **`poster_rating_scrim`**; star: **`primary`** (`text-primary`); numeric value: **`on_surface`**.
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatTmdbVoteAverageLabel, showTmdbVoteAverageBadge } from '../../utils/tmdbDisplayGuards';
import { IconStar } from './SimpleIcons';

function starSize(density: 'sm' | 'md', variant: 'watchlist' | 'search'): number {
  if (density === 'sm') {
    return 10;
  }
  return variant === 'watchlist' ? 14 : 12;
}

export type PosterRatingBadgeProps = {
  voteAverage: number | null | undefined;
  /**
   * Merged after base pill styles — typically `position: 'absolute'`, `top`, `right`, `zIndex`.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * `sm` — Search trending / results grid.\
   * `md` — portrait cards (`ContentCard`, watchlist grid).
   * @default 'md'
   */
  density?: 'sm' | 'md';
  /**
   * **`watchlist`** — star then score, `text-xs`-style value (`watchlist.html`).\
   * **`search`** — score then star, `hero-badge` value (`search.html` trending grid).
   * @default 'search'
   */
  variant?: 'watchlist' | 'search';
};

export function PosterRatingBadge({
  voteAverage,
  style,
  density = 'md',
  variant = 'search',
}: PosterRatingBadgeProps): JSX.Element | null {
  if (typeof voteAverage !== 'number' || !showTmdbVoteAverageBadge(voteAverage)) {
    return null;
  }
  const label = formatTmdbVoteAverageLabel(voteAverage);
  const s = starSize(density, variant);
  const valueStyle = variant === 'watchlist' ? styles.valueWatchlist : styles.valueSearch;

  const starEl = <IconStar color={colors.primary} size={s} />;
  const textEl = <Text style={valueStyle}>{label}</Text>;

  return (
    <View accessibilityLabel={`Rating ${label} out of 10`} style={[styles.badge, style]}>
      {variant === 'watchlist' ? (
        <>
          {starEl}
          {textEl}
        </>
      ) : (
        <>
          {textEl}
          {starEl}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.poster_rating_scrim,
    borderRadius: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  valueSearch: {
    ...typography['hero-badge'],
    color: colors.on_surface,
    textTransform: 'none',
  },
  /** `watchlist.html` rating row — `text-xs` value with star; weight reads bold beside icon. */
  valueWatchlist: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontFamily: typography['title-search-card'].fontFamily,
    fontWeight: '700',
    textTransform: 'none',
  },
});
