/**
 * Year · rating · genres · runtime — `movie-showDetail.html`: plain chips (`surface_container_high` + muted);
 * rating chip (`secondary_container`/30 + `text-secondary` / bold + filled star).
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
import { fill, layout, spacing } from '../../theme/spacing';
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
  const chips: { key: string; kind: 'plain' | 'rating'; node: ReactNode }[] = [];

  const year = yearFromRelease(movie.release_date);
  if (year != null) {
    chips.push({
      key: 'year',
      kind: 'plain',
      node: <Text style={styles.chipTextPlain}>{year}</Text>,
    });
  }

  const rating = movie.vote_average;
  if (showTmdbVoteAverageBadge(rating)) {
    const label = formatTmdbVoteAverageLabel(rating);
    chips.push({
      key: 'rating',
      kind: 'rating',
      node: (
        <View style={styles.chipRowInner}>
          <IconStar color={colors.primary} size={14} />
          <Text style={styles.chipTextRating}>
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
      kind: 'plain',
      node: (
        <Text numberOfLines={2} style={styles.chipTextPlain}>
          {genres}
        </Text>
      ),
    });
  }

  const runtime = movie.runtime;
  if (showTmdbRuntimeChip(runtime) && typeof runtime === 'number') {
    chips.push({
      key: 'runtime',
      kind: 'plain',
      node: <Text style={styles.chipTextPlain}>{formatRuntimeLabel(runtime)}</Text>,
    });
  }

  if (chips.length === 0) {
    return <View />;
  }

  return (
    <View style={styles.row}>
      {chips.map((c) => (
        <View
          key={c.key}
          style={c.kind === 'rating' ? styles.chipWrapRating : styles.chipWrapPlain}
        >
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
  chipTextPlain: {
    ...typography['detail-metadata-chip'],
    color: colors.on_surface_variant,
  },
  chipTextRating: {
    ...typography['detail-rating-chip'],
    color: colors.primary,
  },
  chipWrapPlain: {
    backgroundColor: colors.surface_container_high,
    borderRadius: layout.detailMetadataChipRadius,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipWrapRating: {
    backgroundColor: colors.detail_rating_chip_background,
    borderRadius: layout.detailMetadataChipRadius,
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
