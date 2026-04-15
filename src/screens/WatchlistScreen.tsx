import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WatchlistItem } from '../api/types';
import { WatchlistBecauseYouSavedSection } from '../components/watchlist/WatchlistBecauseYouSavedSection';
import { WatchlistEmptyState } from '../components/watchlist/WatchlistEmptyState';
import { WatchlistFilterEmpty } from '../components/watchlist/WatchlistFilterEmpty';
import { WatchlistGridCard } from '../components/watchlist/WatchlistGridCard';
import { IconSearch } from '../components/common/SimpleIcons';
import { SearchAppBar } from '../components/search/SearchAppBar';
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
    movieGenres,
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
        genres={movieGenres}
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
    [gridColWidth, handleRemove, movieGenres, navigation],
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
      <View style={styles.screen}>
        <View style={[styles.headerDock, { paddingTop: insets.top + spacing.sm }]}>
          <SearchAppBar beforeProfile={searchAppBarTrailing} onPressProfile={onPressProfile} />
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: insets.bottom + spacing.xxl,
              paddingTop: spacing.lg,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
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
                navigation.navigate('Detail', { movieId });
              }}
              popularRecommendations={popularRecommendations}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.headerDock, { paddingTop: insets.top + spacing.sm }]}>
        <SearchAppBar beforeProfile={searchAppBarTrailing} onPressProfile={onPressProfile} />
      </View>
      <FlatList
        style={styles.scroll}
        columnWrapperStyle={[styles.gridRow, { gap: gridGutter, paddingHorizontal: horizontalPad }]}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: insets.bottom + spacing.xxl,
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appBarIconHit: {
    padding: spacing.xs,
  },
  appBarIconHitPressed: {
    opacity: 0.85,
  },
  headerDock: {
    backgroundColor: colors.surface,
    zIndex: 1,
  },
  screen: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  scroll: {
    flex: 1,
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
