import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HOME_CHIP_DEFINITIONS,
  HOME_GENRE_RAIL_KEYS,
  type HomeChipKey,
  type HomeChipResolved,
  type HomeGenreRailKey,
} from '../api/types';
import { HomeContentRow } from '../components/home/HomeContentRow';
import { HomeGenreStrip } from '../components/home/HomeGenreStrip';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeHero } from '../components/home/HomeHero';
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

function railSectionTitle(railKey: HomeGenreRailKey): string {
  return HOME_CHIP_DEFINITIONS.find((d) => d.key === railKey)?.label ?? railKey;
}

function row3SectionTitle(selectedChipKey: HomeChipKey, chips: readonly HomeChipResolved[]): string {
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
    genreRails,
    loadMoreTrending,
    loadMoreTopRated,
    loadMoreGenre,
    loadMoreGenreRail,
  } = useHome();

  const anyRowLoadingMore =
    trending.loadingMore ||
    topRated.loadingMore ||
    (selectedChipKey === 'all'
      ? HOME_GENRE_RAIL_KEYS.some((k) => genreRails[k].loadingMore)
      : genre.loadingMore);

  const row3Title = row3SectionTitle(selectedChipKey, chips);

  const openDetail = (movieId: number): void => {
    navigation.navigate('Detail', { movieId });
  };

  const seeAllTrending = (): void => {
    navigation.navigate('SeeAll', { title: 'Trending Now', mode: 'trending' });
  };

  const seeAllTopRated = (): void => {
    navigation.navigate('SeeAll', { title: 'Top Rated', mode: 'top_rated' });
  };

  const seeAllDiscover = (title: string, railKey: HomeChipKey): void => {
    const gid = chips.find((c) => c.key === railKey)?.genreId;
    navigation.navigate('SeeAll', {
      title,
      mode: 'discover',
      ...(gid != null ? { genreId: gid } : {}),
    });
  };

  const seeAllRow3 = (): void => {
    seeAllDiscover(row3Title, selectedChipKey);
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
          hasMore={trending.hasMore}
          items={trending.items}
          loading={trending.loading}
          loadingMore={trending.loadingMore}
          onNearEnd={loadMoreTrending}
          onOpenDetail={openDetail}
          onRetry={refetch}
          onSeeAll={seeAllTrending}
          sectionTitle="Trending Now"
        />
        <HomeContentRow
          error={topRated.error}
          hasMore={topRated.hasMore}
          items={topRated.items}
          loading={topRated.loading}
          loadingMore={topRated.loadingMore}
          onNearEnd={loadMoreTopRated}
          onOpenDetail={openDetail}
          onRetry={refetch}
          onSeeAll={seeAllTopRated}
          sectionTitle="Top Rated"
        />
        {selectedChipKey === 'all'
          ? HOME_GENRE_RAIL_KEYS.map((railKey) => {
              const title = railSectionTitle(railKey);
              const feed = genreRails[railKey];
              return (
                <HomeContentRow
                  key={railKey}
                  error={feed.error}
                  hasMore={feed.hasMore}
                  items={feed.items}
                  loading={feed.loading}
                  loadingMore={feed.loadingMore}
                  onNearEnd={() => {
                    loadMoreGenreRail(railKey);
                  }}
                  onOpenDetail={openDetail}
                  onRetry={refetch}
                  onSeeAll={() => {
                    seeAllDiscover(title, railKey);
                  }}
                  rowContent="genre"
                  sectionTitle={title}
                />
              );
            })
          : (
              <HomeContentRow
                error={genre.error}
                hasMore={genre.hasMore}
                items={genre.items}
                loading={genre.loading}
                loadingMore={genre.loadingMore}
                onNearEnd={loadMoreGenre}
                onOpenDetail={openDetail}
                onRetry={refetch}
                onSeeAll={seeAllRow3}
                rowContent="genre"
                sectionTitle={row3Title}
              />
            )}
        {anyRowLoadingMore ? (
          <View style={styles.loadMoreFooter}>
            <ActivityIndicator accessibilityLabel="Loading more movies" color={colors.primary} size="small" />
            <Text style={styles.loadMoreFooterText}>Loading more content</Text>
          </View>
        ) : null}
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
  loadMoreFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    opacity: 0.9,
    paddingVertical: spacing.xl,
  },
  loadMoreFooterText: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
