import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WatchlistItem } from '../api/types';
import { WatchlistBecauseYouSavedSection } from '../components/watchlist/WatchlistBecauseYouSavedSection';
import { WatchlistEmptyState } from '../components/watchlist/WatchlistEmptyState';
import { WatchlistFilterEmpty } from '../components/watchlist/WatchlistFilterEmpty';
import { WatchlistGridCard } from '../components/watchlist/WatchlistGridCard';
import { WatchlistScreenHeader } from '../components/watchlist/WatchlistScreenHeader';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchlistStore } from '../store/watchlistStore';
import { getWatchlistSimilarMovieAnchorId } from '../utils/watchlistFilters';
import type {
  RootStackParamList,
  RootTabParamList,
  WatchlistStackParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = CompositeScreenProps<
  NativeStackScreenProps<WatchlistStackParamList, 'WatchlistMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Watchlist'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

function watchlistItemKey(item: WatchlistItem): string {
  return `${item.mediaType}-${String(item.id)}`;
}

/** Watchlist tab main — PSD-Watchlist §3 (populated) / §5 (empty) + `useWatchlist` only for data. */
export function WatchlistScreen({ navigation }: Props): JSX.Element {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const {
    hydrated,
    count,
    items,
    filter,
    setFilter,
    filteredItems,
    similar,
    popularRecommendations,
  } = useWatchlist();

  const persistWriteError = useWatchlistStore((s) => s.persistWriteError);
  const clearPersistWriteError = useWatchlistStore((s) => s.clearPersistWriteError);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const lastAlertedPersistError = useRef<string | null>(null);

  useEffect(() => {
    if (persistWriteError == null || persistWriteError === lastAlertedPersistError.current) {
      return;
    }
    lastAlertedPersistError.current = persistWriteError;
    Alert.alert('Watchlist', persistWriteError, [
      {
        text: 'OK',
        onPress: () => {
          clearPersistWriteError();
          lastAlertedPersistError.current = null;
        },
      },
    ]);
  }, [clearPersistWriteError, persistWriteError]);

  const horizontalPad = spacing.xl;
  const gridGutter = spacing.md;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridGutter) / 2;
  const ctaWidth = windowWidth - horizontalPad * 2;

  const handleRemove = useCallback(
    (id: number) => {
      removeItem(id);
    },
    [removeItem],
  );

  const onBrowseTrending = useCallback(() => {
    navigation.navigate('Home', { screen: 'HomeMain' });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: WatchlistItem }) => (
      <WatchlistGridCard
        detailsEnabled={item.mediaType === 'movie'}
        item={item}
        onPressDetails={() => {
          navigation.navigate('Detail', { movieId: item.id });
        }}
        onPressRemove={() => {
          handleRemove(item.id);
        }}
        style={{ width: gridColWidth }}
      />
    ),
    [gridColWidth, handleRemove, navigation],
  );

  if (!hydrated) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.mutedCenter}>Loading…</Text>
      </View>
    );
  }

  const tailItem = items.length > 0 ? items[items.length - 1] : undefined;
  const savedTitle =
    tailItem != null && tailItem.title.trim().length > 0 ? tailItem.title.trim() : 'this title';
  const similarMovies = similar.data?.results ?? [];
  const similarAnchorMovieId = getWatchlistSimilarMovieAnchorId(items);
  const showBecauseYouSavedRow =
    count >= 1 &&
    !similar.loading &&
    similar.error == null &&
    similarMovies.length > 0 &&
    similarAnchorMovieId != null;

  if (count === 0) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + spacing.xxl,
            paddingTop: insets.top + spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        style={styles.screen}
      >
        <View style={{ paddingHorizontal: horizontalPad }}>
          <WatchlistScreenHeader
            countLine="0 titles"
            filter={filter}
            setFilter={setFilter}
            showChips={false}
          />
          <WatchlistEmptyState
            ctaWidth={ctaWidth}
            onBrowseTrending={onBrowseTrending}
            onOpenTrendingMovie={(movieId) => {
              navigation.navigate('Detail', { movieId });
            }}
            popularRecommendations={popularRecommendations}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        columnWrapperStyle={[styles.gridRow, { gap: gridGutter, paddingHorizontal: horizontalPad }]}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: insets.bottom + spacing.xxl,
            paddingTop: insets.top + spacing.lg,
          },
        ]}
        data={filteredItems}
        extraData={`${String(count)}-${filter}`}
        keyExtractor={watchlistItemKey}
        ListEmptyComponent={
          count > 0 && filteredItems.length === 0 ? (
            <WatchlistFilterEmpty filter={filter} onBrowseAll={() => setFilter('all')} />
          ) : undefined
        }
        ListHeaderComponent={
          <View style={{ paddingHorizontal: horizontalPad }}>
            <WatchlistScreenHeader filter={filter} setFilter={setFilter} showChips />
            {showBecauseYouSavedRow ? (
              <WatchlistBecauseYouSavedSection
                movies={similarMovies}
                onPressMovie={(movieId) => {
                  navigation.navigate('Detail', { movieId });
                }}
                onPressSeeAll={() => {
                  if (similarAnchorMovieId == null) {
                    return;
                  }
                  navigation.navigate('Home', {
                    screen: 'SeeAll',
                    params: {
                      title: `Because you saved ${savedTitle}`,
                      mode: 'similar',
                      similarSourceMovieId: similarAnchorMovieId,
                    },
                  });
                }}
                savedTitle={savedTitle}
              />
            ) : null}
          </View>
        }
        numColumns={2}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedCenter: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
  },
  listContent: {
    flexGrow: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.xl,
  },
});
