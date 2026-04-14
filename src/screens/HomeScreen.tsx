import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHome } from '../hooks/useHome';
import type {
  HomeStackParamList,
  RootStackParamList,
  RootTabParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Home'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

const TEST_DETAIL_MOVIE_ID = 550;

function rowDebugLabel(name: string, count: number, page: number, hasMore: boolean): string {
  return `${name}: ${String(count)} items · page ${String(page)} · hasMore ${String(hasMore)}`;
}

export function HomeScreen({ navigation }: Props) {
  const {
    loading,
    error,
    refetch,
    hero,
    heroLoading,
    genresError,
    chips,
    selectedChipKey,
    setSelectedChipKey,
    trending,
    topRated,
    genre,
    loadMoreTrending,
    loadMoreTopRated,
    loadMoreGenre,
  } = useHome();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      <Text style={styles.title}>Home</Text>

      {loading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : null}
      {(error ?? genresError) ? (
        <View style={styles.errorBlock}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {genresError ? <Text style={styles.errorText}>{genresError}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading home data"
            onPress={refetch}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading ? (
        <View style={styles.dataBlock}>
          <Text style={styles.section}>Hero (trending first)</Text>
          <Text style={styles.body}>
            {heroLoading
              ? 'Hero loading…'
              : hero
                ? hero.title
                : '—'}
          </Text>

          <Text style={styles.section}>Chips (row 3 filter)</Text>
          <View style={styles.chipRow}>
            {chips.map((c) => {
              const active = c.key === selectedChipKey;
              return (
                <Pressable
                  key={c.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Filter ${c.label}`}
                  onPress={() => {
                    setSelectedChipKey(c.key);
                  }}
                  style={({ pressed }) => [
                    styles.chip,
                    active && styles.chipActive,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                    {c.label}
                    {c.genreId != null ? ` (#${String(c.genreId)})` : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.section}>Rows</Text>
          <Text style={styles.body}>
            {rowDebugLabel(
              'Trending',
              trending.items.length,
              trending.page,
              trending.hasMore,
            )}
          </Text>
          {trending.error ? (
            <Text style={styles.errorText}>{trending.error}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Load more trending"
            disabled={!trending.hasMore || trending.loadingMore || trending.loading}
            onPress={loadMoreTrending}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              (!trending.hasMore || trending.loadingMore || trending.loading) &&
                styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonLabel}>More trending</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all trending movies"
            onPress={() =>
              navigation.navigate('SeeAll', {
                title: 'Trending',
                mode: 'trending',
              })
            }
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>See all trending</Text>
          </Pressable>

          <Text style={styles.body}>
            {rowDebugLabel(
              'Top rated',
              topRated.items.length,
              topRated.page,
              topRated.hasMore,
            )}
          </Text>
          {topRated.error ? (
            <Text style={styles.errorText}>{topRated.error}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Load more top rated"
            disabled={!topRated.hasMore || topRated.loadingMore || topRated.loading}
            onPress={loadMoreTopRated}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              (!topRated.hasMore || topRated.loadingMore || topRated.loading) &&
                styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonLabel}>More top rated</Text>
          </Pressable>

          <Text style={styles.body}>
            {rowDebugLabel(
              'Discover',
              genre.items.length,
              genre.page,
              genre.hasMore,
            )}
          </Text>
          {genre.error ? <Text style={styles.errorText}>{genre.error}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Load more discover"
            disabled={!genre.hasMore || genre.loadingMore || genre.loading}
            onPress={loadMoreGenre}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              (!genre.hasMore || genre.loadingMore || genre.loading) &&
                styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonLabel}>More discover</Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open detail with test movie id"
        onPress={() =>
          navigation.navigate('Detail', { movieId: TEST_DETAIL_MOVIE_ID })
        }
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonLabel}>
          Open Detail (movieId {String(TEST_DETAIL_MOVIE_ID)})
        </Text>
      </Pressable>
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
  section: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.sm,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_high,
  },
  chipActive: {
    backgroundColor: colors.secondary_container,
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipLabel: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  chipLabelActive: {
    color: colors.on_surface,
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
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
  },
});
