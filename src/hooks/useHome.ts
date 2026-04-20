/**
 * Home tab — **`UseQueryResult<HomeTabSnapshot>`**: `data` holds feeds, chips, and row actions;
 * top-level `loading` is bootstrap; `error` is genre-list failure; `refetch` reloads genres + feeds.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DISCOVER_MIN_VOTE_COUNT,
  DISCOVER_SORT_NEWEST,
  DISCOVER_SORT_POPULARITY,
  DISCOVER_SORT_VOTE_AVERAGE,
  getDiscoverMovies,
  getMovieGenres,
  getTopRatedMovies,
  getTrendingMoviesWeek,
} from '../api/movies';
import type {
  HomeChipKey,
  HomeChipResolved,
  HomeFeedRowState,
  HomeTabSnapshot,
  TmdbGenre,
  TmdbMovieListItem,
  TmdbPagedMoviesResponse,
  UseQueryResult,
} from '../api/types';
import { createInitialHomeFeedRowState } from '../api/types';
import { mergeUniqueMovieListById } from '../utils/mergeUniqueMovieListById';
import { isLikelyCanceledRequest, mapUnknownError } from '../utils/mapUnknownError';

function sortGenresByName(genres: readonly TmdbGenre[]): TmdbGenre[] {
  return [...genres].sort((a, b) => a.name.localeCompare(b.name));
}

function genreIdsSorted(genres: readonly TmdbGenre[]): number[] {
  return sortGenresByName(genres).map((g) => g.id);
}

function buildResolvedChips(genres: readonly TmdbGenre[]): readonly HomeChipResolved[] {
  const sorted = sortGenresByName(genres);
  return [
    { key: 'all', label: 'All', genreId: null },
    ...sorted.map((g) => ({ key: g.id, label: g.name, genreId: g.id })),
  ];
}

function discoverParamsForChip(
  chipKey: HomeChipKey,
  genres: readonly TmdbGenre[],
): { page: number; with_genres?: number } | { error: string } {
  if (chipKey === 'all') {
    return { page: 1 };
  }
  if (typeof chipKey !== 'number' || !Number.isFinite(chipKey)) {
    return { error: 'Invalid genre filter' };
  }
  const exists = genres.some((g) => g.id === chipKey);
  if (!exists) {
    return genres.length === 0
      ? { error: 'Genres not loaded' }
      : { error: `Genre id ${chipKey} not in TMDB genre list` };
  }
  return { page: 1, with_genres: chipKey };
}

function applyPageResponse(
  prev: HomeFeedRowState,
  response: TmdbPagedMoviesResponse,
  append: boolean,
): HomeFeedRowState {
  const items = append
    ? mergeUniqueMovieListById(prev.items, response.results)
    : [...response.results];
  return {
    items,
    loading: false,
    loadingMore: false,
    error: null,
    page: response.page,
    hasMore: response.page < response.total_pages,
  };
}

function feedStateFromSettled(
  result: PromiseSettledResult<TmdbPagedMoviesResponse>,
): HomeFeedRowState {
  if (result.status === 'fulfilled') {
    return applyPageResponse(
      { ...createInitialHomeFeedRowState(), loading: true, loadingMore: false },
      result.value,
      false,
    );
  }
  return {
    ...createInitialHomeFeedRowState(),
    loading: false,
    error: mapUnknownError(result.reason),
  };
}

function idleGenreRailsRecord(ids: readonly number[]): Record<number, HomeFeedRowState> {
  return Object.fromEntries(ids.map((id) => [id, createInitialHomeFeedRowState()]));
}

export function useHome(): UseQueryResult<HomeTabSnapshot> {
  const [genres, setGenres] = useState<readonly TmdbGenre[]>([]);
  const [genresError, setGenresError] = useState<string | null>(null);
  const [trending, setTrending] = useState<HomeFeedRowState>(() => ({
    ...createInitialHomeFeedRowState(),
    loading: true,
  }));
  const [topRated, setTopRated] = useState<HomeFeedRowState>(() => ({
    ...createInitialHomeFeedRowState(),
    loading: true,
  }));
  const [genre, setGenre] = useState<HomeFeedRowState>(() => ({
    ...createInitialHomeFeedRowState(),
    loading: true,
  }));
  const [genreRails, setGenreRails] = useState<Record<number, HomeFeedRowState>>(() => ({}));
  const [selectedChipKey, setSelectedChipKey] = useState<HomeChipKey>('all');
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const hasCompletedInitialBootstrapRef = useRef(false);
  const dataGenerationRef = useRef(0);
  const genreDiscoverGenRef = useRef(0);

  useEffect(() => {
    if (!bootstrapLoading) {
      hasCompletedInitialBootstrapRef.current = true;
    }
  }, [bootstrapLoading]);

  const chipKeyRef = useRef<HomeChipKey>(selectedChipKey);
  chipKeyRef.current = selectedChipKey;

  const genresRef = useRef<readonly TmdbGenre[]>(genres);
  genresRef.current = genres;

  const trendingRef = useRef(trending);
  trendingRef.current = trending;
  const topRatedRef = useRef(topRated);
  topRatedRef.current = topRated;
  const genreRef = useRef(genre);
  genreRef.current = genre;
  const genreRailsRef = useRef(genreRails);
  genreRailsRef.current = genreRails;

  /** Per-rail in-flight `activateGenreRail` requests — aborted on chip change / refetch cleanup. */
  const railAbortControllersRef = useRef<Map<number, AbortController>>(new Map());

  const skipChipDiscoverOnMount = useRef(true);

  const abortAllRailFetches = useCallback((): void => {
    for (const c of railAbortControllersRef.current.values()) {
      c.abort();
    }
    railAbortControllersRef.current.clear();
  }, []);

  /** Full refetch: genres + page 1 for trending & top rated (global or genre-scoped discover per chip). */
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    dataGenerationRef.current += 1;
    const generation = dataGenerationRef.current;
    genreDiscoverGenRef.current += 1;
    const discoverGenAtBootstrapStart = genreDiscoverGenRef.current;

    setBootstrapLoading(true);
    setGenresError(null);
    setTrending({ ...createInitialHomeFeedRowState(), loading: true });
    setTopRated({ ...createInitialHomeFeedRowState(), loading: true });
    const chipAtBootstrap = chipKeyRef.current;
    if (chipAtBootstrap === 'all') {
      setGenre({ ...createInitialHomeFeedRowState(), loading: false });
    } else {
      setGenre({ ...createInitialHomeFeedRowState(), loading: true });
    }
    setGenreRails({});

    (async () => {
      try {
      let loadedGenres: readonly TmdbGenre[] = [];
      try {
        const genresRes = await getMovieGenres({ signal: controller.signal });
        if (cancelled || generation !== dataGenerationRef.current) {
          return;
        }
        loadedGenres = genresRes.genres;
        setGenres(loadedGenres);
      } catch (e) {
        if (cancelled || generation !== dataGenerationRef.current) {
          return;
        }
        setGenres([]);
        setGenresError(mapUnknownError(e));
      }

      const chip = chipKeyRef.current;

      if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
        /* Chip-driven fetch took over; do not overwrite rows / rails. */
      } else if (chip === 'all') {
        const settled = await Promise.allSettled([
          getTrendingMoviesWeek({ page: 1, signal: controller.signal }),
          getTopRatedMovies({ page: 1, signal: controller.signal }),
        ]);

        if (cancelled || generation !== dataGenerationRef.current) {
          return;
        }
        if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
          return;
        }

        const [trendingRes, topRatedRes] = settled;
        setTrending(feedStateFromSettled(trendingRes));
        setTopRated(feedStateFromSettled(topRatedRes));

        const sortedIds = genreIdsSorted(loadedGenres);
        if (cancelled || generation !== dataGenerationRef.current) {
          return;
        }
        if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
          return;
        }
        setGenreRails(idleGenreRailsRecord(sortedIds));
        setGenre({ ...createInitialHomeFeedRowState(), loading: false });
      } else {
        const discoverInput = discoverParamsForChip(chip, loadedGenres);
        if ('error' in discoverInput) {
          setTrending({
            ...createInitialHomeFeedRowState(),
            loading: false,
            error: discoverInput.error,
          });
          setTopRated({
            ...createInitialHomeFeedRowState(),
            loading: false,
            error: discoverInput.error,
          });
          setGenre({
            ...createInitialHomeFeedRowState(),
            loading: false,
            error: discoverInput.error,
          });
          setGenreRails({});
        } else {
          const settled = await Promise.allSettled([
            getDiscoverMovies({
              ...discoverInput,
              sort_by: DISCOVER_SORT_POPULARITY,
              signal: controller.signal,
            }),
            getDiscoverMovies({
              ...discoverInput,
              sort_by: DISCOVER_SORT_VOTE_AVERAGE,
              vote_count_gte: DISCOVER_MIN_VOTE_COUNT,
              signal: controller.signal,
            }),
            getDiscoverMovies({
              ...discoverInput,
              sort_by: DISCOVER_SORT_NEWEST,
              signal: controller.signal,
            }),
          ]);

          if (cancelled || generation !== dataGenerationRef.current) {
            return;
          }
          if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
            return;
          }

          const [trendRes, topRes, genreRes] = settled;
          setTrending(feedStateFromSettled(trendRes));
          setTopRated(feedStateFromSettled(topRes));
          setGenre(feedStateFromSettled(genreRes));
          setGenreRails({});
        }
      }
      } finally {
        if (!cancelled && generation === dataGenerationRef.current) {
          setBootstrapLoading(false);
        }
      }
    })().catch(() => {
      /* failures surfaced via row / genresError state */
    });

    return () => {
      cancelled = true;
      controller.abort();
      abortAllRailFetches();
    };
  }, [reloadToken, abortAllRailFetches]);

  /**
   * Chip change (skipped on first mount): **`all`** → global trending + top rated + per-genre rails;
   * **genre chip** → discover for hero, Trending, Top Rated, and a third row (newest in genre) after Top Rated.
   */
  useEffect(() => {
    if (skipChipDiscoverOnMount.current) {
      skipChipDiscoverOnMount.current = false;
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    genreDiscoverGenRef.current += 1;
    const discoverGen = genreDiscoverGenRef.current;

    const chip = chipKeyRef.current;
    if (chip === 'all') {
      abortAllRailFetches();
      setGenre({ ...createInitialHomeFeedRowState(), loading: false });
      const ids = genreIdsSorted(genresRef.current);
      setGenreRails(idleGenreRailsRecord(ids));
      setTrending({ ...createInitialHomeFeedRowState(), loading: true });
      setTopRated({ ...createInitialHomeFeedRowState(), loading: true });

      (async () => {
        const settled = await Promise.allSettled([
          getTrendingMoviesWeek({ page: 1, signal: controller.signal }),
          getTopRatedMovies({ page: 1, signal: controller.signal }),
        ]);
        if (cancelled || discoverGen !== genreDiscoverGenRef.current) {
          return;
        }
        const [trendingRes, topRatedRes] = settled;
        setTrending(feedStateFromSettled(trendingRes));
        setTopRated(feedStateFromSettled(topRatedRes));
      })().catch(() => {
        /* surfaced via trending / topRated.error */
      });

      return () => {
        cancelled = true;
        controller.abort();
        abortAllRailFetches();
      };
    }

    setTrending({ ...createInitialHomeFeedRowState(), loading: true });
    setTopRated({ ...createInitialHomeFeedRowState(), loading: true });
    setGenre({ ...createInitialHomeFeedRowState(), loading: true });
    setGenreRails({});

    (async () => {
      const g = genresRef.current;
      const chipNow = chipKeyRef.current;

      const discoverInput = discoverParamsForChip(chipNow, g);
      if ('error' in discoverInput) {
        setTrending({
          ...createInitialHomeFeedRowState(),
          loading: false,
          error: discoverInput.error,
        });
        setTopRated({
          ...createInitialHomeFeedRowState(),
          loading: false,
          error: discoverInput.error,
        });
        setGenre({
          ...createInitialHomeFeedRowState(),
          loading: false,
          error: discoverInput.error,
        });
        return;
      }
      const settled = await Promise.allSettled([
        getDiscoverMovies({
          ...discoverInput,
          sort_by: DISCOVER_SORT_POPULARITY,
          signal: controller.signal,
        }),
        getDiscoverMovies({
          ...discoverInput,
          sort_by: DISCOVER_SORT_VOTE_AVERAGE,
          vote_count_gte: DISCOVER_MIN_VOTE_COUNT,
          signal: controller.signal,
        }),
        getDiscoverMovies({
          ...discoverInput,
          sort_by: DISCOVER_SORT_NEWEST,
          signal: controller.signal,
        }),
      ]);
      if (cancelled || discoverGen !== genreDiscoverGenRef.current) {
        return;
      }
      const [trendRes, topRes, genreRes] = settled;
      setTrending(feedStateFromSettled(trendRes));
      setTopRated(feedStateFromSettled(topRes));
      setGenre(feedStateFromSettled(genreRes));
    })().catch(() => {
      /* surfaced via trending / topRated.error */
    });

    return () => {
      cancelled = true;
      controller.abort();
      abortAllRailFetches();
    };
  }, [selectedChipKey, abortAllRailFetches]);

  const loadMoreTrending = useCallback(() => {
    const prev = trendingRef.current;
    const genAtStart = dataGenerationRef.current;
    const discoverGenAtStart = genreDiscoverGenRef.current;
    const chip = chipKeyRef.current;
    if (prev.loading || prev.loadingMore || !prev.hasMore || prev.error) {
      return;
    }
    const nextPage = prev.page + 1;
    const loadingState: HomeFeedRowState = { ...prev, loadingMore: true };
    trendingRef.current = loadingState;
    setTrending(loadingState);

    (async () => {
      try {
        const data =
          chip === 'all'
            ? await getTrendingMoviesWeek({ page: nextPage })
            : await (async () => {
                const discoverInput = discoverParamsForChip(chip, genresRef.current);
                if ('error' in discoverInput) {
                  throw new Error(discoverInput.error);
                }
                return getDiscoverMovies({
                  ...discoverInput,
                  page: nextPage,
                  sort_by: DISCOVER_SORT_POPULARITY,
                });
              })();
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current
        ) {
          setTrending((curr) =>
            curr.loadingMore ? { ...curr, loadingMore: false } : curr,
          );
          return;
        }
        setTrending((curr) => {
          if (!curr.loadingMore) {
            return curr;
          }
          return applyPageResponse(curr, data, true);
        });
      } catch (e) {
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current
        ) {
          setTrending((curr) =>
            curr.loadingMore ? { ...curr, loadingMore: false } : curr,
          );
          return;
        }
        setTrending((curr) => ({
          ...curr,
          loadingMore: false,
          error: mapUnknownError(e),
        }));
      }
    })().catch(() => {
      /* surfaced via trending.error */
    });
  }, []);

  const loadMoreTopRated = useCallback(() => {
    const prev = topRatedRef.current;
    const genAtStart = dataGenerationRef.current;
    const discoverGenAtStart = genreDiscoverGenRef.current;
    const chip = chipKeyRef.current;
    if (prev.loading || prev.loadingMore || !prev.hasMore || prev.error) {
      return;
    }
    const nextPage = prev.page + 1;
    const loadingState: HomeFeedRowState = { ...prev, loadingMore: true };
    topRatedRef.current = loadingState;
    setTopRated(loadingState);

    (async () => {
      try {
        const data =
          chip === 'all'
            ? await getTopRatedMovies({ page: nextPage })
            : await (async () => {
                const discoverInput = discoverParamsForChip(chip, genresRef.current);
                if ('error' in discoverInput) {
                  throw new Error(discoverInput.error);
                }
                return getDiscoverMovies({
                  ...discoverInput,
                  page: nextPage,
                  sort_by: DISCOVER_SORT_VOTE_AVERAGE,
                  vote_count_gte: DISCOVER_MIN_VOTE_COUNT,
                });
              })();
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current
        ) {
          setTopRated((curr) =>
            curr.loadingMore ? { ...curr, loadingMore: false } : curr,
          );
          return;
        }
        setTopRated((curr) => {
          if (!curr.loadingMore) {
            return curr;
          }
          return applyPageResponse(curr, data, true);
        });
      } catch (e) {
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current
        ) {
          setTopRated((curr) =>
            curr.loadingMore ? { ...curr, loadingMore: false } : curr,
          );
          return;
        }
        setTopRated((curr) => ({
          ...curr,
          loadingMore: false,
          error: mapUnknownError(e),
        }));
      }
    })().catch(() => {
      /* surfaced via topRated.error */
    });
  }, []);

  const loadMoreGenre = useCallback(() => {
    if (chipKeyRef.current === 'all') {
      return;
    }
    const prev = genreRef.current;
    const genAtStart = dataGenerationRef.current;
    const discoverGenAtStart = genreDiscoverGenRef.current;
    if (prev.loading || prev.loadingMore || !prev.hasMore || prev.error) {
      return;
    }
    const nextPage = prev.page + 1;
    const loadingState: HomeFeedRowState = { ...prev, loadingMore: true };
    genreRef.current = loadingState;
    setGenre(loadingState);

    (async () => {
      try {
        const chip = chipKeyRef.current;
        const discoverInput = discoverParamsForChip(chip, genresRef.current);
        if ('error' in discoverInput) {
          throw new Error(discoverInput.error);
        }
        const data = await getDiscoverMovies({
          ...discoverInput,
          page: nextPage,
          sort_by: DISCOVER_SORT_NEWEST,
        });
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current
        ) {
          setGenre((curr) =>
            curr.loadingMore ? { ...curr, loadingMore: false } : curr,
          );
          return;
        }
        setGenre((curr) => {
          if (!curr.loadingMore) {
            return curr;
          }
          return applyPageResponse(curr, data, true);
        });
      } catch (e) {
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current
        ) {
          setGenre((curr) =>
            curr.loadingMore ? { ...curr, loadingMore: false } : curr,
          );
          return;
        }
        setGenre((curr) => ({
          ...curr,
          loadingMore: false,
          error: mapUnknownError(e),
        }));
      }
    })().catch(() => {
      /* surfaced via genre.error */
    });
  }, []);

  const loadMoreGenreRail = useCallback((genreId: number) => {
    if (chipKeyRef.current !== 'all') {
      return;
    }
    const prev = genreRailsRef.current[genreId];
    if (prev == null) {
      return;
    }
    const genAtStart = dataGenerationRef.current;
    const discoverGenAtStart = genreDiscoverGenRef.current;
    if (prev.loading || prev.loadingMore || !prev.hasMore || prev.error) {
      return;
    }
    const nextPage = prev.page + 1;
    const loadingState: HomeFeedRowState = { ...prev, loadingMore: true };
    const nextRails: Record<number, HomeFeedRowState> = {
      ...genreRailsRef.current,
      [genreId]: loadingState,
    };
    genreRailsRef.current = nextRails;
    setGenreRails(nextRails);

    (async () => {
      try {
        const discoverInput = discoverParamsForChip(genreId, genresRef.current);
        if ('error' in discoverInput) {
          throw new Error(discoverInput.error);
        }
        const data = await getDiscoverMovies({
          ...discoverInput,
          page: nextPage,
        });
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current ||
          chipKeyRef.current !== 'all'
        ) {
          setGenreRails((curr) => ({
            ...curr,
            [genreId]:
              curr[genreId]?.loadingMore === true
                ? { ...curr[genreId], loadingMore: false }
                : curr[genreId],
          }));
          return;
        }
        setGenreRails((curr) => {
          const row = curr[genreId];
          if (row == null || !row.loadingMore) {
            return curr;
          }
          return {
            ...curr,
            [genreId]: applyPageResponse(row, data, true),
          };
        });
      } catch (e) {
        if (
          genAtStart !== dataGenerationRef.current ||
          discoverGenAtStart !== genreDiscoverGenRef.current ||
          chipKeyRef.current !== 'all'
        ) {
          setGenreRails((curr) => ({
            ...curr,
            [genreId]:
              curr[genreId]?.loadingMore === true
                ? { ...curr[genreId], loadingMore: false }
                : curr[genreId],
          }));
          return;
        }
        setGenreRails((curr) => ({
          ...curr,
          [genreId]: {
            ...(curr[genreId] ?? createInitialHomeFeedRowState()),
            loadingMore: false,
            error: mapUnknownError(e),
          },
        }));
      }
    })().catch(() => {
      /* surfaced via genreRails[genreId].error */
    });
  }, []);

  const activateGenreRail = useCallback(
    (genreId: number) => {
      if (chipKeyRef.current !== 'all') {
        return;
      }
      const g = genresRef.current;
      const row = genreRailsRef.current[genreId];
      if (row == null) {
        return;
      }
      if (row.loading) {
        return;
      }
      if (row.items.length > 0 || row.page > 0) {
        return;
      }

      const discoverInput = discoverParamsForChip(genreId, g);
      if ('error' in discoverInput) {
        setGenreRails((curr) => ({
          ...curr,
          [genreId]: {
            ...createInitialHomeFeedRowState(),
            loading: false,
            error: discoverInput.error,
          },
        }));
        return;
      }

      railAbortControllersRef.current.get(genreId)?.abort();
      const ac = new AbortController();
      railAbortControllersRef.current.set(genreId, ac);

      setGenreRails((curr) => ({
        ...curr,
        [genreId]: {
          ...(curr[genreId] ?? createInitialHomeFeedRowState()),
          loading: true,
          loadingMore: false,
          error: null,
        },
      }));

      (async () => {
        try {
          const data = await getDiscoverMovies({
            ...discoverInput,
            signal: ac.signal,
          });
          if (ac.signal.aborted || chipKeyRef.current !== 'all') {
            return;
          }
          setGenreRails((curr) => {
            const prevRow = curr[genreId];
            if (prevRow == null) {
              return curr;
            }
            return {
              ...curr,
              [genreId]: applyPageResponse(
                { ...prevRow, loading: true, loadingMore: false },
                data,
                false,
              ),
            };
          });
        } catch (e) {
          if (ac.signal.aborted || isLikelyCanceledRequest(e)) {
            return;
          }
          if (chipKeyRef.current !== 'all') {
            return;
          }
          setGenreRails((curr) => ({
            ...curr,
            [genreId]: {
              ...createInitialHomeFeedRowState(),
              loading: false,
              error: mapUnknownError(e),
            },
          }));
        } finally {
          railAbortControllersRef.current.delete(genreId);
        }
      })().catch(() => {
        /* surfaced via genreRails[genreId].error */
      });
    },
    [],
  );

  const refetch = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  const chips = useMemo(() => buildResolvedChips(genres), [genres]);

  const hero: TmdbMovieListItem | null = trending.items[0] ?? null;
  const heroLoading = trending.page === 0 && (trending.loading || trending.loadingMore);

  const snapshot = useMemo(
    (): HomeTabSnapshot => ({
      hero,
      heroLoading,
      genres: [...genres],
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
    }),
    [
      hero,
      heroLoading,
      genres,
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
    ],
  );

  return {
    data:
      bootstrapLoading && !hasCompletedInitialBootstrapRef.current ? null : snapshot,
    loading: bootstrapLoading,
    error: genresError,
    refetch,
  };
}
