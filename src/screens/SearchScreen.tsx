import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSearch } from '../hooks/useSearch';
import type {
  RootStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'SearchMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Search'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

const TEST_DETAIL_MOVIE_ID = 27205;

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const { data, loading, error, refetch } = useSearch(query);

  const previewTitles = data?.results.slice(0, 5) ?? [];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      style={styles.container}
    >
      <Text style={styles.title}>Search</Text>

      <TextInput
        accessibilityLabel="Search movies"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setQuery}
        placeholder="Search movies"
        placeholderTextColor={colors.on_surface_variant}
        style={styles.input}
        value={query}
      />

      {query.trim().length === 0 ? (
        <Text style={styles.muted}>Type a query to search TMDB.</Text>
      ) : null}

      {query.trim().length > 0 && loading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : null}
      {error ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry search"
            onPress={refetch}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {data && query.trim().length > 0 && !loading && !error ? (
        <View style={styles.dataBlock}>
          <Text style={styles.body}>
            Page {String(data.page)} / {String(data.total_pages)} —{' '}
            {String(data.results.length)} on this page
          </Text>
          {previewTitles.map((m) => (
            <Text key={m.id} style={styles.body}>
              {m.title}
            </Text>
          ))}
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
  input: {
    ...typography['body-md'],
    color: colors.on_surface,
    backgroundColor: colors.surface_container,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
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
    gap: spacing.xs,
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
