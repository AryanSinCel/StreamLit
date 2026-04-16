import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { HomeChipKey, HomeChipResolved } from '../api/types';
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

function row3SectionTitle(selectedChipKey: HomeChipKey, chips: readonly HomeChipResolved[]): string {
  return chips.find((c) => c.key === selectedChipKey)?.label ?? 'Discover';
}

/** Preload genre rails slightly before they scroll into view (`resources/home.html` pacing). */
const GENRE_RAIL_VISIBILITY_BUFFER_PX = spacing.xxl + spacing.xxxl;

export function HomeScreen({ navigation }: Props): JSX.Element {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const {
    error: genresError,
    genres,
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
    activateGenreRail,
  } = useHome();

  const genreRailIds = useMemo((): number[] => {
    return chips
      .filter((c): c is HomeChipResolved & { key: number } => typeof c.key === 'number')
      .map((c) => c.key);
  }, [chips]);

  const genreRailLayoutRef = useRef(new Map<number, { y: number; height: number }>());
  const scrollMetricsRef = useRef({ offsetY: 0, viewportH: windowHeight });

  const runGenreRailVisibilityPass = useCallback(() => {
    const { offsetY, viewportH } = scrollMetricsRef.current;
    const top = offsetY - GENRE_RAIL_VISIBILITY_BUFFER_PX;
    const bottom = offsetY + viewportH + GENRE_RAIL_VISIBILITY_BUFFER_PX;
    for (const [genreId, { y, height }] of genreRailLayoutRef.current) {
      const rowBottom = y + height;
      if (rowBottom > top && y < bottom) {
        activateGenreRail(genreId);
      }
    }
  }, [activateGenreRail]);

  useEffect(() => {
    scrollMetricsRef.current.viewportH = windowHeight;
  }, [windowHeight]);

  useEffect(() => {
    if (selectedChipKey !== 'all') {
      genreRailLayoutRef.current.clear();
      return;
    }
    const id = requestAnimationFrame(() => {
      runGenreRailVisibilityPass();
    });
    return () => {
      cancelAnimationFrame(id);
    };
  }, [selectedChipKey, genreRailIds, runGenreRailVisibilityPass]);

  const handleHomeScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      scrollMetricsRef.current = {
        offsetY: contentOffset.y,
        viewportH: layoutMeasurement.height,
      };
      runGenreRailVisibilityPass();
    },
    [runGenreRailVisibilityPass],
  );

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

  const seeAllDiscover = (title: string, chipKey: HomeChipKey): void => {
    const gid = chips.find((c) => c.key === chipKey)?.genreId;
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
        onContentSizeChange={runGenreRailVisibilityPass}
        onScroll={handleHomeScroll}
        scrollEventThrottle={16}
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
          genres={genres}
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
          genres={genres}
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
          ? genreRailIds.map((railGenreId) => {
              const title = chips.find((c) => c.key === railGenreId)?.label ?? 'Genre';
              const feed = genreRails[railGenreId];
              if (feed == null) {
                return null;
              }
              const awaitingLazyLoad =
                feed.page === 0 &&
                !feed.loading &&
                feed.error == null &&
                feed.items.length === 0;
              return (
                <View
                  key={railGenreId}
                  onLayout={(e) => {
                    const { y, height } = e.nativeEvent.layout;
                    genreRailLayoutRef.current.set(railGenreId, { y, height });
                    runGenreRailVisibilityPass();
                  }}
                >
                  <HomeContentRow
                    awaitingLazyLoad={awaitingLazyLoad}
                    error={feed.error}
                    genres={genres}
                    hasMore={feed.hasMore}
                    items={feed.items}
                    loading={feed.loading}
                    loadingMore={feed.loadingMore}
                    onNearEnd={() => {
                      loadMoreGenreRail(railGenreId);
                    }}
                    onOpenDetail={openDetail}
                    onRetry={() => {
                      activateGenreRail(railGenreId);
                    }}
                    onSeeAll={() => {
                      seeAllDiscover(title, railGenreId);
                    }}
                    rowContent="genre"
                    sectionTitle={title}
                  />
                </View>
              );
            })
          : (
              <HomeContentRow
                error={genre.error}
                genres={genres}
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
