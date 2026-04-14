/**
 * Home data hook — returns `UseHomeResult` (structured), not `UseQueryResult<T>`:
 * top-level `loading` / `error` / `refetch` cover the initial bootstrap; each row has
 * its own `loading`, `loadingMore`, `error`, `page`, `hasMore`, and `items` with append-on-load-more.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getDiscoverMovies,
  getMovieGenres,
  getTopRatedMovies,
  getTrendingMoviesWeek,
} from '../api/movies';
import type {
  HomeChipKey,
  HomeChipResolved,
  HomeFeedRowState,
  HomeGenreRailKey,
  TmdbGenre,
  TmdbMovieListItem,
  TmdbPagedMoviesResponse,
  UseHomeResult,
} from '../api/types';
import {
  HOME_CHIP_DEFINITIONS,
  HOME_GENRE_RAIL_KEYS,
  createInitialHomeFeedRowState,
} from '../api/types';
import { mergeUniqueMovieListById } from '../utils/mergeUniqueMovieListById';
import { mapUnknownError } from '../utils/mapUnknownError';

function findGenreIdByName(genres: readonly TmdbGenre[], tmdbName: string): number | null {
  const target = tmdbName.trim().toLowerCase();
  for (const g of genres) {
    if (g.name.trim().toLowerCase() === target) {
      return g.id;
    }
  }
  return null;
}

function buildResolvedChips(genres: readonly TmdbGenre[]): readonly HomeChipResolved[] {
  return HOME_CHIP_DEFINITIONS.map((def) => ({
    key: def.key,
    label: def.label,
    genreId:
      def.tmdbGenreName === null
        ? null
        : findGenreIdByName(genres, def.tmdbGenreName),
  }));
}

function discoverParamsForChip(
  chipKey: HomeChipKey,
  genres: readonly TmdbGenre[],
): { page: number; with_genres?: number } | { error: string } {
  if (chipKey === 'all') {
    return { page: 1 };
  }
  const def = HOME_CHIP_DEFINITIONS.find((d) => d.key === chipKey);
  const name = def?.tmdbGenreName;
  if (!name) {
    return { page: 1 };
  }
  const id = findGenreIdByName(genres, name);
  if (id === null) {
    return {
      error: `Genre "${name}" not found in TMDB genre list`,
    };
  }
  return { page: 1, with_genres: id };
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

function idleGenreRailsRecord(): Record<HomeGenreRailKey, HomeFeedRowState> {
  return Object.fromEntries(
    HOME_GENRE_RAIL_KEYS.map((k) => [k, createInitialHomeFeedRowState()]),
  ) as Record<HomeGenreRailKey, HomeFeedRowState>;
}

function loadingGenreRailsRecord(): Record<HomeGenreRailKey, HomeFeedRowState> {
  return Object.fromEntries(
    HOME_GENRE_RAIL_KEYS.map((k) => [
      k,
      { ...createInitialHomeFeedRowState(), loading: true },
    ]),
  ) as Record<HomeGenreRailKey, HomeFeedRowState>;
}

export function useHome(): UseHomeResult {
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
  const [genreRails, setGenreRails] = useState<Record<HomeGenreRailKey, HomeFeedRowState>>(() =>
    loadingGenreRailsRecord(),
  );
  const [selectedChipKey, setSelectedChipKey] = useState<HomeChipKey>('all');
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const dataGenerationRef = useRef(0);
  const genreDiscoverGenRef = useRef(0);

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

  const skipChipDiscoverOnMount = useRef(true);

  /** Full refetch: genres + page 1 for all three rows (discover uses current chip via ref). */
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
      setGenreRails(loadingGenreRailsRecord());
    } else {
      setGenre({ ...createInitialHomeFeedRowState(), loading: true });
      setGenreRails(idleGenreRailsRecord());
    }

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

      const settled = await Promise.allSettled([
        getTrendingMoviesWeek({ page: 1, signal: controller.signal }),
        getTopRatedMovies({ page: 1, signal: controller.signal }),
      ]);

      if (cancelled || generation !== dataGenerationRef.current) {
        return;
      }

      const [trendingRes, topRatedRes] = settled;

      if (trendingRes.status === 'fulfilled') {
        setTrending((prev) =>
          applyPageResponse(
            { ...prev, loading: true, loadingMore: false },
            trendingRes.value,
            false,
          ),
        );
      } else {
        setTrending({
          ...createInitialHomeFeedRowState(),
          loading: false,
          error: mapUnknownError(trendingRes.reason),
        });
      }

      if (topRatedRes.status === 'fulfilled') {
        setTopRated((prev) =>
          applyPageResponse(
            { ...prev, loading: true, loadingMore: false },
            topRatedRes.value,
            false,
          ),
        );
      } else {
        setTopRated({
          ...createInitialHomeFeedRowState(),
          loading: false,
          error: mapUnknownError(topRatedRes.reason),
        });
      }

      const chip = chipKeyRef.current;

      if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
        /* Chip-driven discover took over; do not overwrite row 3 / rails. */
      } else if (chip === 'all') {
        const railSettled = await Promise.allSettled(
          HOME_GENRE_RAIL_KEYS.map((k) => {
            const inp = discoverParamsForChip(k, loadedGenres);
            if ('error' in inp) {
              return Promise.reject(new Error(inp.error));
            }
            return getDiscoverMovies({
              ...inp,
              signal: controller.signal,
            });
          }),
        );

        if (cancelled || generation !== dataGenerationRef.current) {
          return;
        }
        if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
          return;
        }

        setGenreRails(() => {
          const next = { ...idleGenreRailsRecord() };
          HOME_GENRE_RAIL_KEYS.forEach((k, i) => {
            const res = railSettled[i];
            if (res != null && res.status === 'fulfilled') {
              next[k] = applyPageResponse(
                { ...createInitialHomeFeedRowState(), loading: true, loadingMore: false },
                res.value,
                false,
              );
            } else if (res != null && res.status === 'rejected') {
              next[k] = {
                ...createInitialHomeFeedRowState(),
                loading: false,
                error: mapUnknownError(res.reason),
              };
            }
          });
          return next;
        });
        setGenre({ ...createInitialHomeFeedRowState(), loading: false });
      } else {
        const discoverInput = discoverParamsForChip(chip, loadedGenres);
        if ('error' in discoverInput) {
          setGenre({
            ...createInitialHomeFeedRowState(),
            loading: false,
            error: discoverInput.error,
          });
        } else {
          try {
            const data = await getDiscoverMovies({
              ...discoverInput,
              signal: controller.signal,
            });
            if (cancelled || generation !== dataGenerationRef.current) {
              return;
            }
            if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
              return;
            }
            setGenre((prev) =>
              applyPageResponse(
                { ...prev, loading: true, loadingMore: false },
                data,
                false,
              ),
            );
          } catch (e) {
            if (cancelled || generation !== dataGenerationRef.current) {
              return;
            }
            if (discoverGenAtBootstrapStart !== genreDiscoverGenRef.current) {
              return;
            }
            setGenre({
              ...createInitialHomeFeedRowState(),
              loading: false,
              error: mapUnknownError(e),
            });
          }
        }
        setGenreRails(idleGenreRailsRecord());
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
    };
  }, [reloadToken]);

  /** Chip change: `all` → six genre rails; specific chip → single discover row (skipped on first mount). */
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
      setGenre({ ...createInitialHomeFeedRowState(), loading: false });
      setGenreRails(loadingGenreRailsRecord());
    } else {
      setGenre({ ...createInitialHomeFeedRowState(), loading: true });
      setGenreRails(idleGenreRailsRecord());
    }

    (async () => {
      const g = genresRef.current;
      const chipNow = chipKeyRef.current;

      if (chipNow === 'all') {
        const railSettled = await Promise.allSettled(
          HOME_GENRE_RAIL_KEYS.map((k) => {
            const inp = discoverParamsForChip(k, g);
            if ('error' in inp) {
              return Promise.reject(new Error(inp.error));
            }
            return getDiscoverMovies({
              ...inp,
              signal: controller.signal,
            });
          }),
        );
        if (cancelled || discoverGen !== genreDiscoverGenRef.current) {
          return;
        }
        setGenreRails(() => {
          const next = { ...idleGenreRailsRecord() };
          HOME_GENRE_RAIL_KEYS.forEach((k, i) => {
            const res = railSettled[i];
            if (res != null && res.status === 'fulfilled') {
              next[k] = applyPageResponse(
                { ...createInitialHomeFeedRowState(), loading: true, loadingMore: false },
                res.value,
                false,
              );
            } else if (res != null && res.status === 'rejected') {
              next[k] = {
                ...createInitialHomeFeedRowState(),
                loading: false,
                error: mapUnknownError(res.reason),
              };
            }
          });
          return next;
        });
        return;
      }

      const discoverInput = discoverParamsForChip(chipNow, g);
      try {
        if ('error' in discoverInput) {
          throw new Error(discoverInput.error);
        }
        const data = await getDiscoverMovies({
          ...discoverInput,
          signal: controller.signal,
        });
        if (cancelled || discoverGen !== genreDiscoverGenRef.current) {
          return;
        }
        setGenre((prev) =>
          applyPageResponse(
            { ...prev, loading: true, loadingMore: false },
            data,
            false,
          ),
        );
      } catch (e) {
        if (cancelled || discoverGen !== genreDiscoverGenRef.current) {
          return;
        }
        setGenre({
          ...createInitialHomeFeedRowState(),
          loading: false,
          error: mapUnknownError(e),
        });
      }
    })().catch(() => {
      /* surfaced via genre / genreRails.error */
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedChipKey]);

  const loadMoreTrending = useCallback(() => {
    const prev = trendingRef.current;
    const genAtStart = dataGenerationRef.current;
    if (prev.loading || prev.loadingMore || !prev.hasMore || prev.error) {
      return;
    }
    const nextPage = prev.page + 1;
    const loadingState: HomeFeedRowState = { ...prev, loadingMore: true };
    trendingRef.current = loadingState;
    setTrending(loadingState);

    (async () => {
      try {
        const data = await getTrendingMoviesWeek({ page: nextPage });
        if (genAtStart !== dataGenerationRef.current) {
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
        if (genAtStart !== dataGenerationRef.current) {
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
    if (prev.loading || prev.loadingMore || !prev.hasMore || prev.error) {
      return;
    }
    const nextPage = prev.page + 1;
    const loadingState: HomeFeedRowState = { ...prev, loadingMore: true };
    topRatedRef.current = loadingState;
    setTopRated(loadingState);

    (async () => {
      try {
        const data = await getTopRatedMovies({ page: nextPage });
        if (genAtStart !== dataGenerationRef.current) {
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
        if (genAtStart !== dataGenerationRef.current) {
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

  const loadMoreGenreRail = useCallback((key: HomeGenreRailKey) => {
    if (chipKeyRef.current !== 'all') {
      return;
    }
    const prev = genreRailsRef.current[key];
    const genAtStart = dataGenerationRef.current;
    const discoverGenAtStart = genreDiscoverGenRef.current;
    if (prev.loading || prev.loadingMore || !prev.hasMore || prev.error) {
      return;
    }
    const nextPage = prev.page + 1;
    const loadingState: HomeFeedRowState = { ...prev, loadingMore: true };
    const nextRails: Record<HomeGenreRailKey, HomeFeedRowState> = {
      ...genreRailsRef.current,
      [key]: loadingState,
    };
    genreRailsRef.current = nextRails;
    setGenreRails(nextRails);

    (async () => {
      try {
        const discoverInput = discoverParamsForChip(key, genresRef.current);
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
            [key]: curr[key].loadingMore ? { ...curr[key], loadingMore: false } : curr[key],
          }));
          return;
        }
        setGenreRails((curr) => {
          if (!curr[key].loadingMore) {
            return curr;
          }
          return {
            ...curr,
            [key]: applyPageResponse(curr[key], data, true),
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
            [key]: curr[key].loadingMore ? { ...curr[key], loadingMore: false } : curr[key],
          }));
          return;
        }
        setGenreRails((curr) => ({
          ...curr,
          [key]: {
            ...curr[key],
            loadingMore: false,
            error: mapUnknownError(e),
          },
        }));
      }
    })().catch(() => {
      /* surfaced via genreRails[key].error */
    });
  }, []);

  const refetch = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  const chips = useMemo(() => buildResolvedChips(genres), [genres]);

  const hero: TmdbMovieListItem | null = trending.items[0] ?? null;
  const heroLoading = trending.page === 0 && (trending.loading || trending.loadingMore);

  const loading = bootstrapLoading;
  const error = genresError;

  return {
    loading,
    error,
    refetch,
    hero,
    heroLoading,
    genres: [...genres],
    genresError,
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
  };
}
