/**
 * Year · rating · genres · runtime — `movie-showDetail.html` (rounded-md chips, rating pill).
 */

import type { JSX, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieDetail } from '../../api/types';
import {
  formatTmdbVoteAverageLabel,
  showTmdbRuntimeChip,
  showTmdbVoteAverageBadge,
} from '../../utils/tmdbDisplayGuards';
import { IconStar } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type DetailChipsRowProps = {
  movie: TmdbMovieDetail;
};

function yearFromRelease(releaseDate: string | null): string | null {
  if (releaseDate == null || releaseDate.length < 4) {
    return null;
  }
  return releaseDate.slice(0, 4);
}

function genreLabel(movie: TmdbMovieDetail): string | null {
  if (movie.genres.length === 0) {
    return null;
  }
  return movie.genres.map((g) => g.name).join(' · ');
}

function formatRuntimeLabel(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) {
      return `${String(h)}h`;
    }
    return `${String(h)}h ${String(m)}m`;
  }
  return `${String(minutes)} min`;
}

export function DetailChipsRow({ movie }: DetailChipsRowProps): JSX.Element {
  const chips: { key: string; node: ReactNode }[] = [];

  const year = yearFromRelease(movie.release_date);
  if (year != null) {
    chips.push({
      key: 'year',
      node: <Text style={styles.chipTextNeutral}>{year}</Text>,
    });
  }

  const rating = movie.vote_average;
  if (showTmdbVoteAverageBadge(rating)) {
    const label = formatTmdbVoteAverageLabel(rating);
    chips.push({
      key: 'rating',
      node: (
        <View style={styles.ratingChip}>
          <IconStar color={colors.primary} size={14} />
          <Text style={styles.ratingChipText}>
            {label}
            {' Rating'}
          </Text>
        </View>
      ),
    });
  }

  const genres = genreLabel(movie);
  if (genres != null && genres.length > 0) {
    chips.push({
      key: 'genre',
      node: (
        <Text numberOfLines={2} style={styles.chipTextNeutral}>
          {genres}
        </Text>
      ),
    });
  }

  const runtime = movie.runtime;
  if (showTmdbRuntimeChip(runtime) && typeof runtime === 'number') {
    chips.push({
      key: 'runtime',
      node: <Text style={styles.chipTextNeutral}>{formatRuntimeLabel(runtime)}</Text>,
    });
  }

  if (chips.length === 0) {
    return <View />;
  }

  return (
    <View style={styles.row}>
      {chips.map((c) => (
        <View key={c.key} style={c.key === 'rating' ? styles.ratingChipWrap : styles.chipWrap}>
          {c.node}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chipTextNeutral: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontWeight: '500',
  },
  chipWrap: {
    backgroundColor: colors.surface_container_high,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  ratingChip: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  ratingChipText: {
    ...typography['label-sm'],
    color: colors.primary,
    fontWeight: '700',
  },
  ratingChipWrap: {
    backgroundColor: colors.detail_rating_chip_bg,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: 0,
  },
});
