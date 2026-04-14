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

/** Home “See All” list — maps to `getTrendingMoviesWeek` | `getTopRatedMovies` | `getDiscoverMovies`. */
export type SeeAllMode = 'trending' | 'top_rated' | 'discover';

export type HomeStackParamList = {
  HomeMain: undefined;
  SeeAll: {
    title: string;
    mode: SeeAllMode;
    genreId?: number;
  };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: { movieId: number };
};

export type WatchlistStackParamList = {
  WatchlistMain: undefined;
};

/** Profile: placeholder only — single main route until a real flow exists. */
export type ProfileStackParamList = {
  ProfileMain: undefined;
};
