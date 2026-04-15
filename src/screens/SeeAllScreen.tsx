import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TmdbMovieListItem } from '../api/types';
import { ContentCard } from '../components/common/ContentCard';
import { SeeAllGridSkeleton } from '../components/seeAll/SeeAllGridSkeleton';
import { useSeeAll } from '../hooks/useSeeAll';
import type {
  HomeStackParamList,
  RootStackParamList,
  RootTabParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatListMovieSubtitle } from '../utils/formatMovieListItem';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'SeeAll'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Home'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

/**
 * Home stack “See All” — native stack header + **`route.params.title`**; 2-column **`ContentCard`** grid (PSD-Home list intent).
 */
export function SeeAllScreen({ navigation, route }: Props): JSX.Element {
  const { mode, genreId, similarSourceMovieId } = route.params;
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { items, hasMore, loading, loadingMore, error, refetch, loadMore } = useSeeAll({
    mode,
    genreId,
    similarSourceMovieId,
  });

  const horizontalPad = spacing.xl;
  const gridGutter = spacing.md;
  const gridColWidth = useMemo(
    () => (windowWidth - horizontalPad * 2 - gridGutter) / 2,
    [gridGutter, horizontalPad, windowWidth],
  );

  const onOpenDetail = useCallback(
    (movieId: number) => {
      navigation.navigate('Detail', { movieId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: TmdbMovieListItem }) => (
      <ContentCard
        onPress={() => {
          onOpenDetail(item.id);
        }}
        posterPath={item.poster_path}
        rating={item.vote_average}
        style={{ width: gridColWidth }}
        subtitle={formatListMovieSubtitle(item)}
        title={item.title}
      />
    ),
    [gridColWidth, onOpenDetail],
  );

  const listHeader = useMemo(() => {
    if (error == null || items.length === 0) {
      return null;
    }
    return (
      <View style={styles.inlineError}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          accessibilityLabel="Retry loading list"
          accessibilityRole="button"
          onPress={refetch}
          style={({ pressed }) => [styles.retryBtn, pressed && styles.retryPressed]}
        >
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    );
  }, [error, items.length, refetch]);

  const listEmpty = useMemo(() => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No movies in this list.</Text>
      </View>
    );
  }, [loading]);

  const listFooter = useMemo(() => {
    if (!hasMore || items.length === 0) {
      return null;
    }
    return (
      <View style={styles.footer}>
        {loadingMore ? (
          <ActivityIndicator accessibilityLabel="Loading more titles" color={colors.primary_container} />
        ) : null}
      </View>
    );
  }, [hasMore, items.length, loadingMore]);

  const onEndReached = useCallback(() => {
    if (hasMore && !loadingMore && !loading && items.length > 0) {
      loadMore();
    }
  }, [hasMore, items.length, loadMore, loading, loadingMore]);

  const initialSkeleton = loading && items.length === 0 && error == null;
  const blockingError = error != null && items.length === 0 && !loading;

  if (initialSkeleton) {
    return (
      <View style={styles.screen}>
        <View style={[styles.paddedHorizontal, { paddingHorizontal: horizontalPad }]}>
          <SeeAllGridSkeleton />
        </View>
      </View>
    );
  }

  if (blockingError) {
    return (
      <View style={styles.screen}>
        <View style={[styles.paddedHorizontal, styles.blockingErrorBody, { paddingHorizontal: horizontalPad }]}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityLabel="Retry loading list"
            accessibilityRole="button"
            onPress={refetch}
            style={({ pressed }) => [styles.retryBtn, pressed && styles.retryPressed]}
          >
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        key={mode}
        columnWrapperStyle={[styles.gridRow, { gap: gridGutter }]}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: horizontalPad,
            paddingBottom: insets.bottom + spacing.xxl,
            paddingTop: spacing.md,
          },
        ]}
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        ListHeaderComponent={listHeader}
        numColumns={2}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blockingErrorBody: {
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    paddingTop: spacing.lg,
  },
  emptyText: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxxxl,
  },
  errorText: {
    ...typography['body-md'],
    color: colors.primary_container,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  gridRow: {
    justifyContent: 'flex-start',
    marginBottom: spacing.xl,
  },
  inlineError: {
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  listContent: {
    flexGrow: 1,
  },
  paddedHorizontal: {
    flex: 1,
    paddingTop: spacing.md,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryLabel: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  retryPressed: {
    opacity: 0.88,
  },
  screen: {
    backgroundColor: colors.surface,
    flex: 1,
  },
});
