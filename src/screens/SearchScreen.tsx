import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_CHIP_DEFINITIONS, HOME_GENRE_RAIL_KEYS } from '../api/types';
import { SearchAppBar } from '../components/search/SearchAppBar';
import { SearchDefaultView } from '../components/search/SearchDefaultView';
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

/** Search default UI + `useSearch` (S4b). Results grid / zero-state = S5. */
export function SearchScreen(_props: Props): JSX.Element {
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

  const showRecentsBlock = query.trim().length === 0 && !inputFocused;

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
