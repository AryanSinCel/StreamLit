/**
 * Year · rating · genres · runtime — PSD-Detail §7.3 (uniform chips: `surface_container_highest`, `label-sm`).
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
import { fill, spacing } from '../../theme/spacing';
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
      node: <Text style={styles.chipText}>{year}</Text>,
    });
  }

  const rating = movie.vote_average;
  if (showTmdbVoteAverageBadge(rating)) {
    const label = formatTmdbVoteAverageLabel(rating);
    chips.push({
      key: 'rating',
      node: (
        <View style={styles.chipRowInner}>
          <IconStar color={colors.on_surface_variant} size={14} />
          <Text style={styles.chipText}>
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
        <Text numberOfLines={2} style={styles.chipText}>
          {genres}
        </Text>
      ),
    });
  }

  const runtime = movie.runtime;
  if (showTmdbRuntimeChip(runtime) && typeof runtime === 'number') {
    chips.push({
      key: 'runtime',
      node: <Text style={styles.chipText}>{formatRuntimeLabel(runtime)}</Text>,
    });
  }

  if (chips.length === 0) {
    return <View />;
  }

  return (
    <View style={styles.row}>
      {chips.map((c) => (
        <View key={c.key} style={styles.chipWrap}>
          {c.node}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chipRowInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chipText: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  chipWrap: {
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: fill.none,
  },
});
