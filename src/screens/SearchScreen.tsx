import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Keyboard, ScrollView, StyleSheet } from 'react-native';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { TabAppBar } from '../components/common/TabAppBar';
import { TabScreenShell } from '../components/common/TabScreenShell';
import { SearchDefaultView } from '../components/search/SearchDefaultView';
import { SearchResultsStateView } from '../components/search/SearchResultsStateView';
import { useSearch } from '../hooks/useSearch';
import { navigateToDetail } from '../navigation/helpers';
import type {
  RootStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from '../navigation/types';
import { spacing } from '../theme/spacing';
import { normalizeSearchTerm } from '../utils/recentSearches';
import { useTabScreenScrollBottomPadding } from '../utils/tabBarScrollInset';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'SearchMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Search'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

/** Search tab: default (`useSearch` + S4) vs results State 2 (S5b); Detail opens on root stack (no tab bar). */
export function SearchScreen({ navigation }: Props): JSX.Element {
  const scrollBottomPadding = useTabScreenScrollBottomPadding();
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const search = useSearch({ query, setQuery });
  const snap = search.data;

  const genreChipLabels = useMemo(
    () =>
      [...(snap?.movieGenres ?? [])].sort((a, b) => a.name.localeCompare(b.name)).map((g) => g.name),
    [snap?.movieGenres],
  );

  const selectedGenreIndex = useMemo(() => {
    const n = normalizeSearchTerm(query);
    if (n.length === 0) {
      return null;
    }
    const i = genreChipLabels.findIndex(
      (l) => normalizeSearchTerm(l).toLowerCase() === n.toLowerCase(),
    );
    return i >= 0 ? i : null;
  }, [query, genreChipLabels]);

  const trendingResults = snap?.trending?.results ?? [];
  const featuredMovie = trendingResults[0] ?? null;
  const gridMovies = trendingResults.slice(1, 5);

  /** Empty query + at least one stored recent; views also require `!inputFocused` to show the block. */
  const showRecentsBlock =
    query.trim().length === 0 && (snap?.recentSearches.length ?? 0) > 0;

  const openSearchDetail = useCallback(
    (movieId: number) => {
      navigateToDetail(navigation, movieId);
    },
    [navigation],
  );

  const totalResults = snap?.searchPage?.total_results ?? 0;

  const lastSearchNearEndRef = useRef(0);
  const handleSearchScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (snap == null || snap.mode !== 'results') {
        return;
      }
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
      if (distanceFromBottom > spacing.xxxxl * 2) {
        return;
      }
      if (!snap.hasMore || snap.loadingMore || snap.searchLoading) {
        return;
      }
      const now = Date.now();
      if (now - lastSearchNearEndRef.current < 550) {
        return;
      }
      lastSearchNearEndRef.current = now;
      snap.loadMore();
    },
    [snap],
  );

  if (snap == null) {
    return <TabScreenShell topBar={<TabAppBar />} />;
  }

  const d = snap;

  return (
    <TabScreenShell topBar={<TabAppBar />}>
      <ScreenErrorBoundary onRetry={search.refetch} screenLabel="Search" style={styles.scroll}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: scrollBottomPadding,
            },
          ]}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          onScroll={handleSearchScroll}
          onScrollBeginDrag={() => {
            Keyboard.dismiss();
            setInputFocused(false);
          }}
          scrollEventThrottle={16}
          style={styles.scrollFill}
        >
        {d.mode === 'results' ? (
          <SearchResultsStateView
            debouncedQuery={d.debouncedQuery}
            error={search.error}
            hasMore={d.hasMore}
            inputFocused={inputFocused}
            loading={d.searchLoading}
            loadingMore={d.loadingMore}
            onBlurInput={() => setInputFocused(false)}
            onChangeQuery={setQuery}
            onClearRecents={() => {
              d.clearRecentSearches().catch(() => {
                /* errors surfaced via hook state in a later pass if needed */
              });
            }}
            onFocusInput={() => setInputFocused(true)}
            onOpenResult={openSearchDetail}
            onRecentTermPress={(term) => setQuery(term)}
            onRetrySearch={search.refetch}
            query={query}
            recentSearches={d.recentSearches}
            results={d.results}
            showRecentsBlock={showRecentsBlock}
            totalResults={totalResults}
          />
        ) : (
          <SearchDefaultView
            featuredMovie={featuredMovie}
            genreChipLabels={genreChipLabels}
            genres={d.movieGenres}
            gridMovies={gridMovies}
            inputFocused={inputFocused}
            mode={d.mode}
            onBlurInput={() => setInputFocused(false)}
            onChangeQuery={setQuery}
            onClearRecents={() => {
              d.clearRecentSearches().catch(() => {
                /* errors surfaced via hook state in a later pass if needed */
              });
            }}
            onFocusInput={() => setInputFocused(true)}
            onGenreChipPress={d.applyGenreChip}
            onOpenResult={openSearchDetail}
            onRecentTermPress={(term) => setQuery(term)}
            onRetryTrending={search.refetch}
            query={query}
            recentSearches={d.recentSearches}
            selectedGenreIndex={selectedGenreIndex}
            showRecentsBlock={showRecentsBlock}
            trendingError={d.trendingError}
            trendingLoading={d.trendingLoading}
          />
        )}
        </ScrollView>
      </ScreenErrorBoundary>
    </TabScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollFill: {
    flex: 1,
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
});
