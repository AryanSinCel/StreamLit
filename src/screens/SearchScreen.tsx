import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { spacing } from '../theme/spacing';
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
  const { movieGenres } = search;

  const genreChipLabels = useMemo(
    () => [...movieGenres].sort((a, b) => a.name.localeCompare(b.name)).map((g) => g.name),
    [movieGenres],
  );

  const selectedGenreIndex = useMemo(() => {
    const n = normalizeSearchTerm(query);
    if (n.length === 0) {
      return 0;
    }
    const i = genreChipLabels.findIndex((l) => normalizeSearchTerm(l) === n);
    return i >= 0 ? i : null;
  }, [query, genreChipLabels]);

  const trendingResults = search.trending?.results ?? [];
  const featuredMovie = trendingResults[0] ?? null;
  const gridMovies = trendingResults.slice(1, 5);

  /** Empty query and at least one stored recent — hide section when list is empty (hook returns []). */
  const showRecentsBlock = query.trim().length === 0 && search.recentSearches.length > 0;

  const openSearchDetail = useCallback(
    (movieId: number) => {
      navigation.navigate('Detail', { movieId });
    },
    [navigation],
  );

  const totalResults = search.data?.total_results ?? 0;

  const lastSearchNearEndRef = useRef(0);
  const handleSearchScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (search.mode !== 'results') {
        return;
      }
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
      if (distanceFromBottom > spacing.xxxxl * 2) {
        return;
      }
      if (!search.hasMore || search.loadingMore || search.loading) {
        return;
      }
      const now = Date.now();
      if (now - lastSearchNearEndRef.current < 550) {
        return;
      }
      lastSearchNearEndRef.current = now;
      search.loadMore();
    },
    [search],
  );

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
        style={styles.scroll}
      >
        {search.mode === 'results' ? (
          <SearchResultsStateView
            debouncedQuery={search.debouncedQuery}
            error={search.error}
            genreChipLabels={genreChipLabels}
            hasMore={search.hasMore}
            inputFocused={inputFocused}
            loading={search.loading}
            loadingMore={search.loadingMore}
            onBlurInput={() => setInputFocused(false)}
            onChangeQuery={setQuery}
            onClearRecents={() => {
              search.clearRecentSearches().catch(() => {
                /* errors surfaced via hook state in a later pass if needed */
              });
            }}
            onFocusInput={() => setInputFocused(true)}
            onGenreChipPress={search.applyGenreChip}
            onOpenResult={openSearchDetail}
            onRecentTermPress={(term) => setQuery(term)}
            onRetrySearch={search.refetch}
            query={query}
            recentSearches={search.recentSearches}
            results={search.results}
            selectedGenreIndex={selectedGenreIndex}
            showRecentsBlock={showRecentsBlock}
            totalResults={totalResults}
          />
        ) : (
          <SearchDefaultView
            featuredMovie={featuredMovie}
            genreChipLabels={genreChipLabels}
            genres={movieGenres}
            gridMovies={gridMovies}
            inputFocused={inputFocused}
            mode={search.mode}
            onBlurInput={() => setInputFocused(false)}
            onChangeQuery={setQuery}
            onClearRecents={() => {
              search.clearRecentSearches().catch(() => {
                /* errors surfaced via hook state in a later pass if needed */
              });
            }}
            onFocusInput={() => setInputFocused(true)}
            onGenreChipPress={search.applyGenreChip}
            onOpenResult={openSearchDetail}
            onRecentTermPress={(term) => setQuery(term)}
            onRetryTrending={search.refetchTrending}
            query={query}
            recentSearches={search.recentSearches}
            selectedGenreIndex={selectedGenreIndex}
            showRecentsBlock={showRecentsBlock}
            trendingError={search.trendingError}
            trendingLoading={search.trendingLoading}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: '100%',
  },
});
