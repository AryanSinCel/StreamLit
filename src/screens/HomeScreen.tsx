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

export function HomeScreen({ navigation }: Props) {
  const { data, loading, error, refetch } = useHome();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      <Text style={styles.title}>Home</Text>

      {loading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : null}
      {error ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{error}</Text>
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

      {data ? (
        <View style={styles.dataBlock}>
          <Text style={styles.body}>
            Trending (sample):{' '}
            {data.trending.results[0]?.title ?? '—'}
          </Text>
          <Text style={styles.body}>
            Top rated (sample):{' '}
            {data.topRated.results[0]?.title ?? '—'}
          </Text>
          <Text style={styles.body}>
            Genres: {String(data.genres.length)} loaded
          </Text>
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
