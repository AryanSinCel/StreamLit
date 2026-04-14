import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root stack — `Detail` from Home / SeeAll hides the tab bar (global push).
 * Search tab pushes `Detail` on `SearchStackParamList` so back returns to Search (PSD-Search §5).
 */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  Detail: { movieId: number };
};

/** Bottom tabs — nested stack per tab (main routes only; Detail is on root stack). */
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: NavigatorScreenParams<SearchStackParamList>;
  Watchlist: NavigatorScreenParams<WatchlistStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

/**
 * Home “See All” list — `getTrendingMoviesWeek` | `getTopRatedMovies` | `getDiscoverMovies` |
 * `getSimilarMovies` (Watchlist “Because you saved” full list).
 */
export type SeeAllMode = 'trending' | 'top_rated' | 'discover' | 'similar';

export type HomeStackParamList = {
  HomeMain: undefined;
  SeeAll: {
    title: string;
    mode: SeeAllMode;
    genreId?: number;
    /** Required when `mode === 'similar'` — `GET /movie/{id}/similar` anchor. */
    similarSourceMovieId?: number;
  };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: { movieId: number };
};

export type WatchlistStackParamList = {
  WatchlistMain: undefined;
  Detail: { movieId: number };
};

/** Profile: placeholder only — single main route until a real flow exists. */
export type ProfileStackParamList = {
  ProfileMain: undefined;
};
