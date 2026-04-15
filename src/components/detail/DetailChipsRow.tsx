/**
 * Year · rating · genres · runtime chips — PSD-Detail §3–4 (`label-sm`, omit invalid).
 */

import type { JSX, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieDetail } from '../../api/types';
import { IconStar } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { radiusFullPill, spacing } from '../../theme/spacing';
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
  if (typeof rating === 'number' && !Number.isNaN(rating) && rating > 0) {
    const label = rating >= 10 ? '10' : rating.toFixed(1);
    chips.push({
      key: 'rating',
      node: (
        <View style={styles.ratingChip}>
          <IconStar color={colors.primary_container} size={14} />
          <Text style={styles.chipText}>{label}</Text>
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
  if (typeof runtime === 'number' && runtime > 0) {
    chips.push({
      key: 'runtime',
      node: <Text style={styles.chipText}>{`${String(runtime)} min`}</Text>,
    });
  }

  if (chips.length === 0) {
    return <View />;
  }

  return (
    <View style={styles.row}>
      {chips.map((c) => (
        <View key={c.key} style={styles.chip}>
          {c.node}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surface_container_highest,
    borderRadius: radiusFullPill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  chipText: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  ratingChip: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
