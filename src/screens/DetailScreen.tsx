import type { RouteProp } from '@react-navigation/native';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import type { JSX } from 'react';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { useMovieDetail } from '../hooks/useMovieDetail';
import type { RootStackParamList } from '../navigation/types';
import { DetailCastSection } from '../components/detail/DetailCastSection';
import { DetailChipsRow } from '../components/detail/DetailChipsRow';
import { DetailDetailsSkeleton } from '../components/detail/DetailDetailsSkeleton';
import { DetailHero } from '../components/detail/DetailHero';
import { DetailNavBar } from '../components/detail/DetailNavBar';
import { DetailSectionError } from '../components/detail/DetailSectionError';
import { DetailSimilarSection } from '../components/detail/DetailSimilarSection';
import { DetailSynopsisSection } from '../components/detail/DetailSynopsisSection';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { DetailWatchlistButton } from '../components/detail/DetailWatchlistButton';
import { useWatchlistStore } from '../store/watchlistStore';
import { mapMovieDetailToWatchlistItem } from '../utils/mapMovieDetailToWatchlistItem';
import { colors } from '../theme/colors';
import { elevation, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
};

/**
 * Detail — `movie-showDetail.html` / `detail.png`: hero + pull-up body, overlay nav, chips, watchlist CTAs.
 */
export function DetailScreen({ route }: Props): JSX.Element {
  const { movieId } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { details, credits, similar } = useMovieDetail(movieId);

  const { hydrated, storedInWatchlist, addItem, removeItem } = useWatchlistStore(
    useShallow((s) => ({
      hydrated: s.hydrated,
      storedInWatchlist: s.items.some((i) => i.id === movieId),
      addItem: s.addItem,
      removeItem: s.removeItem,
    })),
  );

  const onToggleWatchlist = useCallback(() => {
    const detail = details.data;
    if (detail == null || !hydrated) {
      return;
    }
    if (storedInWatchlist) {
      removeItem(movieId);
      return;
    }
    addItem(mapMovieDetailToWatchlistItem(detail, movieId));
  }, [addItem, details.data, hydrated, movieId, removeItem, storedInWatchlist]);

  const watchlistControl = useMemo(() => {
    if (details.data == null) {
      return null;
    }
    return (
      <DetailWatchlistButton
        hydrated={hydrated}
        onPress={onToggleWatchlist}
        storedInWatchlist={storedInWatchlist}
      />
    );
  }, [details.data, hydrated, onToggleWatchlist, storedInWatchlist]);

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
    navigation.dispatch(StackActions.replace('SeeAll', params));
  }, [navigation, movieId]);

  const onPressSimilarMovie = useCallback(
    (id: number) => {
      navigation.dispatch(CommonActions.navigate({ name: 'Detail', params: { movieId: id } }));
    },
    [navigation],
  );

  const refetchDetailScreen = useCallback(() => {
    details.refetch();
    credits.refetch();
    similar.refetch();
  }, [credits, details, similar]);

  return (
    <View style={styles.screen}>
      <ScreenErrorBoundary onRetry={refetchDetailScreen} screenLabel="Movie detail" style={styles.scroll}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacing.xxl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollFill}
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
            <View style={[styles.mainPull, { paddingHorizontal: horizontalPad }]}>
              <Text style={styles.title}>{details.data.title.toUpperCase()}</Text>
              <DetailChipsRow movie={details.data} />
              {watchlistControl}
              <DetailSynopsisSection key={movieId} overview={details.data.overview} />
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
      </ScreenErrorBoundary>
      <DetailNavBar onBack={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainPull: {
    marginTop: -spacing.xxl,
    zIndex: elevation.screen,
  },
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
  scrollFill: {
    flex: 1,
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    ...typography['watchlist-screen-title'],
    color: colors.on_surface,
    marginBottom: spacing.md,
  },
});
