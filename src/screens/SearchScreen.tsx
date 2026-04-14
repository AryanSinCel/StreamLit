import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_CHIP_DEFINITIONS, HOME_GENRE_RAIL_KEYS } from '../api/types';
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

/** Search tab: default (`useSearch` + S4) vs results State 2 (S5b) + Detail on Search stack. */
export function SearchScreen({ navigation }: Props): JSX.Element {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const search = useSearch({ query, setQuery });

  const genreChipLabels = useMemo(
    () =>
      HOME_GENRE_RAIL_KEYS.map((key) => {
        const def = HOME_CHIP_DEFINITIONS.find((d) => d.key === key);
        return def?.label ?? String(key);
      }),
    [],
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
  const gridMovies = trendingResults.slice(1, 4);

  /** Empty query and at least one stored recent — hide section when list is empty (hook returns []). */
  const showRecentsBlock = query.trim().length === 0 && search.recentSearches.length > 0;

  const openSearchDetail = useCallback(
    (movieId: number) => {
      navigation.navigate('Detail', { movieId });
    },
    [navigation],
  );

  const totalResults = search.data?.total_results ?? 0;

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
        style={styles.scroll}
      >
        {search.mode === 'results' ? (
          <SearchResultsStateView
            debouncedQuery={search.debouncedQuery}
            error={search.error}
            genreChipLabels={genreChipLabels}
            inputFocused={inputFocused}
            loading={search.loading}
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
  },
});
