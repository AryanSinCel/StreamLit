import type { RouteProp } from '@react-navigation/native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { JSX } from 'react';
import { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMovieDetail } from '../hooks/useMovieDetail';
import type {
  RootStackParamList,
  SearchStackParamList,
  WatchlistStackParamList,
} from '../navigation/types';
import { DetailCastSection } from '../components/detail/DetailCastSection';
import { DetailChipsRow } from '../components/detail/DetailChipsRow';
import { DetailDetailsSkeleton } from '../components/detail/DetailDetailsSkeleton';
import { DetailHero } from '../components/detail/DetailHero';
import { DetailNavBar } from '../components/detail/DetailNavBar';
import { DetailSectionError } from '../components/detail/DetailSectionError';
import { DetailSimilarSection } from '../components/detail/DetailSimilarSection';
import { DetailSynopsisSection } from '../components/detail/DetailSynopsisSection';
import { colors } from '../theme/colors';
import { radiusCardInner, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type DetailScreenRouteProp =
  | RouteProp<RootStackParamList, 'Detail'>
  | RouteProp<SearchStackParamList, 'Detail'>
  | RouteProp<WatchlistStackParamList, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
};

/**
 * Detail tab / stack — PSD-Detail §4 layout; **`details` / `credits` / `similar`** from `useMovieDetail` only (D3).
 */
export function DetailScreen({ route }: Props): JSX.Element {
  const { movieId } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { details, credits, similar } = useMovieDetail(movieId);

  const horizontalPad = spacing.xl;
  const contentWidth = Math.max(1, windowWidth - horizontalPad * 2);
  const heroWidth = windowWidth;

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressSeeAllSimilar = useCallback(() => {
    const params = {
      title: 'More Like This',
      mode: 'similar' as const,
      similarSourceMovieId: movieId,
    };
    const tabNav = navigation.getParent();
    if (tabNav != null) {
      tabNav.dispatch(
        CommonActions.navigate({
          name: 'Home',
          params: {
            screen: 'SeeAll',
            params,
          },
        }),
      );
      return;
    }
    navigation.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: {
          screen: 'Home',
          params: {
            screen: 'SeeAll',
            params,
          },
        },
      }),
    );
  }, [navigation, movieId]);

  const onPressSimilarMovie = useCallback(
    (id: number) => {
      navigation.dispatch(CommonActions.navigate({ name: 'Detail', params: { movieId: id } }));
    },
    [navigation],
  );

  return (
    <View style={styles.screen}>
      <DetailNavBar onBack={onBack} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {details.loading && details.data == null ? (
          <DetailDetailsSkeleton contentWidth={contentWidth} heroWidth={heroWidth} />
        ) : null}

        {details.error != null && details.data == null ? (
          <View style={styles.padded}>
            <DetailSectionError
              message={details.error}
              onRetry={details.refetch}
              retryAccessibilityLabel="Retry loading movie details"
            />
          </View>
        ) : null}

        {details.data != null ? (
          <>
            <DetailHero movie={details.data} width={heroWidth} />
            <View style={styles.padded}>
              <Text style={styles.title}>{details.data.title}</Text>
              <DetailChipsRow movie={details.data} />
              <Pressable
                accessibilityHint="Coming soon"
                accessibilityLabel="Add to Watchlist"
                accessibilityRole="button"
                style={({ pressed }) => [styles.watchlistStub, pressed && styles.watchlistStubPressed]}
              >
                <Text style={styles.watchlistStubLabel}>Add to Watchlist</Text>
              </Pressable>
              <DetailSynopsisSection overview={details.data.overview} />
            </View>
          </>
        ) : null}

        <View style={styles.padded}>
          <DetailCastSection
            cast={credits.data?.cast ?? null}
            error={credits.error}
            loading={credits.loading && credits.data == null}
            onRetry={credits.refetch}
          />
          <DetailSimilarSection
            error={similar.error}
            loading={similar.loading && similar.data == null}
            onPressMovie={onPressSimilarMovie}
            onPressSeeAll={onPressSeeAllSimilar}
            onRetry={similar.refetch}
            results={similar.data?.results ?? null}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: spacing.xl,
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
  title: {
    ...typography['display-md'],
    color: colors.on_surface,
    marginTop: spacing.lg,
  },
  watchlistStub: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  watchlistStubLabel: {
    ...typography['title-sm'],
    color: colors.on_primary,
    fontWeight: '700',
  },
  watchlistStubPressed: {
    opacity: 0.9,
  },
});
