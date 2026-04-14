import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeContentRow } from '../components/home/HomeContentRow';
import { HomeGenreStrip } from '../components/home/HomeGenreStrip';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeHero } from '../components/home/HomeHero';
import type { HomeGenreChipKey } from '../components/home/homeStatic';
import {
  HOME_HERO_MOVIE_ID,
  MOCK_ROW3_BY_CHIP,
  MOCK_TOP_RATED_ROW,
  MOCK_TRENDING_ROW,
  homeRow3GenreId,
  homeRow3SectionTitle,
} from '../components/home/homeStatic';
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

export function HomeScreen({ navigation }: Props): JSX.Element {
  const insets = useSafeAreaInsets();
  const [row3Chip, setRow3Chip] = useState<HomeGenreChipKey>('all');

  const row3Cards = MOCK_ROW3_BY_CHIP[row3Chip];
  const row3Title = homeRow3SectionTitle(row3Chip);
  const row3GenreId = homeRow3GenreId(row3Chip);

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
    if (row3GenreId != null) {
      navigation.navigate('SeeAll', {
        title: row3Title,
        mode: 'discover',
        genreId: row3GenreId,
      });
    } else {
      navigation.navigate('SeeAll', {
        title: row3Title,
        mode: 'discover',
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + spacing.xxxxl,
        },
      ]}
      nestedScrollEnabled
      style={styles.container}
    >
      <HomeHeader />
      <HomeGenreStrip onSelect={setRow3Chip} selectedKey={row3Chip} />
      <HomeHero
        onDetails={() => {
          openDetail(HOME_HERO_MOVIE_ID);
        }}
        onWatchNow={() => {
          openDetail(HOME_HERO_MOVIE_ID);
        }}
      />
      <HomeContentRow
        cards={MOCK_TRENDING_ROW}
        onOpenDetail={openDetail}
        onSeeAll={seeAllTrending}
        sectionTitle="Trending Now"
      />
      <HomeContentRow
        cards={MOCK_TOP_RATED_ROW}
        onOpenDetail={openDetail}
        onSeeAll={seeAllTopRated}
        sectionTitle="Top Rated"
      />
      <HomeContentRow
        cards={row3Cards}
        onOpenDetail={openDetail}
        onSeeAll={seeAllRow3}
        sectionTitle={row3Title}
      />
      <View style={styles.loadMore}>
        <ActivityIndicator color={colors.primary} size="small" />
        <Text style={styles.loadMoreText}>Loading more content</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  loadMore: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    opacity: 0.85,
    paddingVertical: spacing.xl,
  },
  loadMoreText: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scrollContent: {
    flexGrow: 1,
  },
});
