import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeContentRow } from '../components/home/HomeContentRow';
import { HomeGenreStrip } from '../components/home/HomeGenreStrip';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeHero } from '../components/home/HomeHero';
import type { HomeChipKey, HomeChipResolved } from '../api/types';
import { useHome } from '../hooks/useHome';
import type {
  HomeStackParamList,
  RootStackParamList,
  RootTabParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Home'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

function row3SectionTitle(selectedChipKey: HomeChipKey, chips: readonly HomeChipResolved[]): string {
  if (selectedChipKey === 'all') {
    return 'Discover';
  }
  return chips.find((c) => c.key === selectedChipKey)?.label ?? 'Discover';
}

export function HomeScreen({ navigation }: Props): JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    error: genresError,
    refetch,
    hero,
    heroLoading,
    chips,
    selectedChipKey,
    setSelectedChipKey,
    trending,
    topRated,
    genre,
  } = useHome();

  const row3Title = row3SectionTitle(selectedChipKey, chips);
  const row3GenreId = chips.find((c) => c.key === selectedChipKey)?.genreId ?? undefined;

  const openDetail = (movieId: number): void => {
    navigation.navigate('Detail', { movieId });
  };

  const seeAllTrending = (): void => {
    navigation.navigate('SeeAll', { title: 'Trending Now', mode: 'trending' });
  };

  const seeAllTopRated = (): void => {
    navigation.navigate('SeeAll', { title: 'Top Rated', mode: 'top_rated' });
  };

  const seeAllRow3 = (): void => {
    navigation.navigate('SeeAll', {
      title: row3Title,
      mode: 'discover',
      ...(row3GenreId != null ? { genreId: row3GenreId } : {}),
    });
  };

  const heroMovieId = hero?.id;

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
        <HomeHeader />
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + spacing.xxxxl,
          },
        ]}
        nestedScrollEnabled
        style={styles.scroll}
      >
      {genresError != null ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{genresError}</Text>
          <Pressable
            accessibilityLabel="Retry loading home data"
            accessibilityRole="button"
            onPress={refetch}
            style={({ pressed }) => [styles.bannerBtn, pressed && styles.bannerBtnPressed]}
          >
            <Text style={styles.bannerBtnLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : null}
      <HomeGenreStrip chips={chips} onSelect={setSelectedChipKey} selectedKey={selectedChipKey} />
      <HomeHero
        loading={heroLoading}
        movie={hero}
        onDetails={() => {
          if (heroMovieId != null) {
            openDetail(heroMovieId);
          }
        }}
        onWatchNow={() => {
          if (heroMovieId != null) {
            openDetail(heroMovieId);
          }
        }}
      />
      <HomeContentRow
        error={trending.error}
        items={trending.items}
        loading={trending.loading}
        onOpenDetail={openDetail}
        onRetry={refetch}
        onSeeAll={seeAllTrending}
        sectionTitle="Trending Now"
      />
      <HomeContentRow
        error={topRated.error}
        items={topRated.items}
        loading={topRated.loading}
        onOpenDetail={openDetail}
        onRetry={refetch}
        onSeeAll={seeAllTopRated}
        sectionTitle="Top Rated"
      />
      <HomeContentRow
        error={genre.error}
        items={genre.items}
        loading={genre.loading}
        onOpenDetail={openDetail}
        onRetry={refetch}
        onSeeAll={seeAllRow3}
        sectionTitle={row3Title}
      />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginBottom: spacing.md,
    marginHorizontal: spacing.xxl,
    padding: spacing.md,
    rowGap: spacing.sm,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bannerBtnLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  bannerBtnPressed: {
    opacity: 0.88,
  },
  bannerText: {
    ...typography['body-md'],
    color: colors.primary_container,
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
});
