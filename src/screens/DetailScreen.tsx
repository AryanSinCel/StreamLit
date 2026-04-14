import type { RouteProp } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMovieDetail } from '../hooks/useMovieDetail';
import type { RootStackParamList, SearchStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'> | RouteProp<SearchStackParamList, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
};

export function DetailScreen({ route }: Props) {
  const { movieId } = route.params;
  const { data, loading, error, refetch } = useMovieDetail(movieId);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      <Text style={styles.title}>Detail</Text>
      <Text style={styles.label}>
        <Text style={styles.labelKey}>movieId</Text>
        {`: ${String(movieId)}`}
      </Text>

      {loading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : null}
      {error ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading movie"
            onPress={refetch}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {data ? (
        <View style={styles.dataBlock}>
          <Text style={styles.headline}>{data.title}</Text>
          <Text style={styles.body}>
            Rating: {String(data.vote_average)} · Runtime:{' '}
            {data.runtime != null ? `${String(data.runtime)} min` : '—'}
          </Text>
          <Text style={styles.body}>
            {data.overview ?? 'No overview.'}
          </Text>
        </View>
      ) : null}

      {!loading && !error && !data ? (
        <Text style={styles.muted}>No detail data</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
  },
  label: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  labelKey: {
    ...typography['body-md'],
    fontWeight: '600',
    color: colors.primary,
  },
  muted: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  dataBlock: {
    gap: spacing.sm,
  },
  errorBlock: {
    gap: spacing.sm,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
  },
});
