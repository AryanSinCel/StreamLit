import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { SearchAppBar } from '../components/search/SearchAppBar';
import { SearchDefaultView } from '../components/search/SearchDefaultView';
import { SearchResultsStateView } from '../components/search/SearchResultsStateView';
import { useSearch } from '../hooks/useSearch';
import type {
  RootStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { elevation, spacing } from '../theme/spacing';
import { normalizeSearchTerm } from '../utils/recentSearches';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'SearchMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Search'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

/** Search tab: default (`useSearch` + S4) vs results State 2 (S5b); Detail opens on root stack (no tab bar). */
export function SearchScreen({ navigation }: Props): JSX.Element {
  const insets = useSafeAreaInsets();
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
      return 0;
    }
    const i = genreChipLabels.findIndex((l) => normalizeSearchTerm(l) === n);
    return i >= 0 ? i : null;
  }, [query, genreChipLabels]);

  const trendingResults = snap?.trending?.results ?? [];
  const featuredMovie = trendingResults[0] ?? null;
  const gridMovies = trendingResults.slice(1, 5);

  /** Empty query and at least one stored recent — hide section when list is empty (hook returns []). */
  const showRecentsBlock = query.trim().length === 0 && (snap?.recentSearches.length ?? 0) > 0;

  const openSearchDetail = useCallback(
    (movieId: number) => {
      navigation.navigate('Detail', { movieId });
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
    return (
      <View style={styles.screen}>
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + spacing.sm,
            },
          ]}
        >
          <SearchAppBar />
        </View>
      </View>
    );
  }

  const d = snap;

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.headerDock,
          {
            paddingTop: insets.top + spacing.sm,
          },
        ]}
      >
        <SearchAppBar />
      </View>
      <ScreenErrorBoundary onRetry={search.refetch} screenLabel="Search" style={styles.scroll}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: insets.bottom + spacing.xxxxl,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          onScroll={handleSearchScroll}
          scrollEventThrottle={16}
          style={styles.scrollFill}
        >
        {d.mode === 'results' ? (
          <SearchResultsStateView
            debouncedQuery={d.debouncedQuery}
            error={search.error}
            genreChipLabels={genreChipLabels}
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
            onGenreChipPress={d.applyGenreChip}
            onOpenResult={openSearchDetail}
            onRecentTermPress={(term) => setQuery(term)}
            onRetrySearch={search.refetch}
            query={query}
            recentSearches={d.recentSearches}
            results={d.results}
            selectedGenreIndex={selectedGenreIndex}
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerDock: {
    backgroundColor: colors.surface,
    zIndex: elevation.dock,
  },
  screen: {
    backgroundColor: colors.surface,
    flex: 1,
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
    width: '100%',
  },
});
