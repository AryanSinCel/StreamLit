import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSeeAll } from '../hooks/useSeeAll';
import type {
  HomeStackParamList,
  RootStackParamList,
  RootTabParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'SeeAll'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Home'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export function SeeAllScreen({ navigation, route }: Props) {
  const { mode, genreId } = route.params;
  const { items, page, hasMore, loading, loadingMore, error, refetch, loadMore } =
    useSeeAll({ mode, genreId });

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        {mode}
        {genreId != null ? ` · genre ${String(genreId)}` : ''}
        {page > 0 ? ` · page ${String(page)}` : ''}
      </Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary_container} />
          <Text style={styles.muted}>Loading…</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry list"
            onPress={refetch}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.muted}>No movies in this list.</Text>
          }
          ListFooterComponent={
            hasMore ? (
              <View style={styles.footer}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Load more movies"
                  disabled={loadingMore}
                  onPress={loadMore}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    loadingMore && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.buttonLabel}>
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </Text>
                </Pressable>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open detail for ${item.title}`}
              onPress={() => navigation.navigate('Detail', { movieId: item.id })}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.rowTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.rowMeta}>
                {item.release_date.length > 0 ? item.release_date : '—'} ·{' '}
                {String(item.vote_average)}
              </Text>
            </Pressable>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  subtitle: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  centered: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  muted: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    padding: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  row: {
    paddingVertical: spacing.md,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowTitle: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  rowMeta: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: 'flex-start',
  },
  errorBlock: {
    padding: spacing.lg,
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
    opacity: 0.5,
  },
  buttonLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
  },
});
