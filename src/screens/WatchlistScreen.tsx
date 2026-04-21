import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import type { WatchlistItem } from '../api/types';
import { WatchlistBecauseYouSavedSection } from '../components/watchlist/WatchlistBecauseYouSavedSection';
import { WatchlistEmptyState } from '../components/watchlist/WatchlistEmptyState';
import { WatchlistFilterEmpty } from '../components/watchlist/WatchlistFilterEmpty';
import { WatchlistGridCard } from '../components/watchlist/WatchlistGridCard';
import { WatchlistScreenSkeleton } from '../components/watchlist/WatchlistScreenSkeleton';
import { IconSearch } from '../components/common/SimpleIcons';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { TabScreenShell } from '../components/common/TabScreenShell';
import { TabAppBar } from '../components/common/TabAppBar';
import { WatchlistScreenHeader } from '../components/watchlist/WatchlistScreenHeader';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchlistStore } from '../store/watchlistStore';
import { useTabScreenScrollBottomPadding } from '../utils/tabBarScrollInset';
import { getWatchlistSimilarMovieAnchorId } from '../utils/watchlistFilters';
import { navigateToDetail, navigateToSeeAll } from '../navigation/helpers';
import type {
  RootStackParamList,
  RootTabParamList,
  WatchlistStackParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { opacity, spacing } from '../theme/spacing';

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

/** Watchlist tab main — populated grid + empty state; data from `useWatchlist` / store only. */
export function WatchlistScreen({ navigation }: Props): JSX.Element {
  const scrollBottomPadding = useTabScreenScrollBottomPadding();
  const { width: windowWidth } = useWindowDimensions();
  const { data: watchlistData, loading: watchlistLoading, refetch: refetchWatchlistRemote } =
    useWatchlist();

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

  const openSearchTab = useCallback(() => {
    navigation.navigate('Search', { screen: 'SearchMain' });
  }, [navigation]);

  const onPressProfile = useCallback(() => {
    Alert.alert('Profile', 'Coming soon', [{ text: 'OK' }]);
  }, []);

  const searchAppBarTrailing = (
    <Pressable
      accessibilityLabel="Search"
      accessibilityRole="button"
      hitSlop={spacing.sm}
      onPress={openSearchTab}
      style={({ pressed }) => [styles.appBarIconHit, pressed && styles.appBarIconHitPressed]}
    >
      <IconSearch color={colors.on_surface_variant} size={22} />
    </Pressable>
  );

  const renderItem = useCallback(
    ({ item }: { item: WatchlistItem }) => (
      <WatchlistGridCard
        detailsEnabled={item.mediaType === 'movie'}
        genres={watchlistData?.movieGenres ?? []}
        item={item}
        onPressDetails={() => {
          navigateToDetail(navigation, item.id);
        }}
        onPressRemove={() => {
          handleRemove(item.id);
        }}
        style={{ width: gridColWidth }}
      />
    ),
    [gridColWidth, handleRemove, navigation, watchlistData],
  );

  if (watchlistLoading || watchlistData == null) {
    return (
      <TabScreenShell
        topBar={<TabAppBar beforeProfile={searchAppBarTrailing} onPressProfile={onPressProfile} />}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: scrollBottomPadding,
              paddingTop: spacing.lg,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollFill}
        >
          <WatchlistScreenSkeleton />
        </ScrollView>
      </TabScreenShell>
    );
  }

  const {
    count,
    items,
    filter,
    setFilter,
    filteredItems,
    similar,
    popularRecommendations,
    trendingContents,
    movieGenres,
  } = watchlistData;

  /** Newest-first store order — first cell is the latest add. */
  const newestItem = items.length > 0 ? items[0] : undefined;
  const savedTitle =
    newestItem != null && newestItem.title.trim().length > 0
      ? newestItem.title.trim()
      : 'this title';
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
      <TabScreenShell
        topBar={<TabAppBar beforeProfile={searchAppBarTrailing} onPressProfile={onPressProfile} />}
      >
        <ScreenErrorBoundary onRetry={refetchWatchlistRemote} screenLabel="Watchlist" style={styles.scroll}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
            {
              paddingBottom: scrollBottomPadding,
              paddingTop: spacing.lg,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollFill}
          >
          <View style={[styles.emptyScrollInner, { paddingHorizontal: horizontalPad }]}>
            <WatchlistScreenHeader
              countLine="0 titles"
              filter={filter}
              setFilter={setFilter}
              showChips={false}
              showTopActions={false}
              style={styles.emptyEditorialHeader}
            />
            <WatchlistEmptyState
              ctaWidth={ctaWidth}
              onBrowseTrending={onBrowseTrending}
              onPressRecommendation={(movieId) => {
                navigateToDetail(navigation, movieId);
              }}
              popularRecommendations={popularRecommendations}
              trendingContents={trendingContents}
            />
          </View>
          </ScrollView>
        </ScreenErrorBoundary>
      </TabScreenShell>
    );
  }

  return (
    <TabScreenShell
      topBar={<TabAppBar beforeProfile={searchAppBarTrailing} onPressProfile={onPressProfile} />}
    >
      <ScreenErrorBoundary onRetry={refetchWatchlistRemote} screenLabel="Watchlist" style={styles.scroll}>
        <FlatList
          columnWrapperStyle={[styles.gridRow, { gap: gridGutter, paddingHorizontal: horizontalPad }]}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: scrollBottomPadding,
              paddingTop: spacing.lg,
            },
          ]}
          data={filteredItems}
          extraData={`${String(count)}-${filter}-${String(movieGenres.length)}`}
          keyExtractor={watchlistItemKey}
          ListEmptyComponent={
            count > 0 && filteredItems.length === 0 ? (
              <WatchlistFilterEmpty filter={filter} onBrowseAll={() => setFilter('all')} />
            ) : undefined
          }
          ListFooterComponent={
            showBecauseYouSavedRow ? (
              <View style={{ paddingHorizontal: horizontalPad }}>
                <WatchlistBecauseYouSavedSection
                  genres={movieGenres}
                  movies={similarMovies}
                  onPressMovie={(movieId) => {
                    navigateToDetail(navigation, movieId);
                  }}
                  onPressSeeAll={() => {
                    if (similarAnchorMovieId == null) {
                      return;
                    }
                    navigateToSeeAll(navigation, {
                      title: `Because you saved ${savedTitle}`,
                      mode: 'similar',
                      similarSourceMovieId: similarAnchorMovieId,
                    });
                  }}
                  savedTitle={savedTitle}
                />
              </View>
            ) : null
          }
          ListHeaderComponent={
            <View style={{ paddingHorizontal: horizontalPad }}>
              <WatchlistScreenHeader filter={filter} setFilter={setFilter} showChips showTopActions={false} />
            </View>
          }
          numColumns={2}
          renderItem={renderItem}
          style={styles.scrollFill}
        />
      </ScreenErrorBoundary>
    </TabScreenShell>
  );
}

const styles = StyleSheet.create({
  appBarIconHit: {
    padding: spacing.xs,
  },
  appBarIconHitPressed: {
    opacity: opacity.pressed,
  },
  scroll: {
    flex: 1,
  },
  scrollFill: {
    flex: 1,
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyEditorialHeader: {
    marginBottom: spacing.xxxl,
  },
  emptyScrollInner: {
    flexGrow: 1,
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
