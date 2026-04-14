import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchAppBar } from '../components/search/SearchAppBar';
import { SearchDefaultView } from '../components/search/SearchDefaultView';
import { MOCK_RECENT_SEARCHES } from '../components/search/searchDefaultMocks';
import type {
  RootStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'SearchMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Search'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

/** S4a: default Search UI only — no `useSearch` / TMDB (S4b+). */
export function SearchScreen(_props: Props): JSX.Element {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedGenreIndex, setSelectedGenreIndex] = useState(0);
  const [recentItems, setRecentItems] = useState<string[]>(() => [...MOCK_RECENT_SEARCHES]);

  const showRecentsBlock = query.trim().length === 0 && !inputFocused;

  const onClearRecents = useCallback(() => {
    setRecentItems([]);
  }, []);

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
          inputFocused={inputFocused}
          onBlurInput={() => setInputFocused(false)}
          onChangeQuery={setQuery}
          onClearRecents={onClearRecents}
          onFocusInput={() => setInputFocused(true)}
          onSelectGenreIndex={setSelectedGenreIndex}
          query={query}
          recentItems={recentItems}
          selectedGenreIndex={selectedGenreIndex}
          showRecentsBlock={showRecentsBlock}
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
