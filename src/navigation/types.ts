import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root stack — Detail sits above tabs so the tab bar is hidden on detail.
 * Tab stacks hold only each tab’s main routes; push Detail via `RootStackParamList`.
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
};

export type WatchlistStackParamList = {
  WatchlistMain: undefined;
};

/** Profile: placeholder only — single main route until a real flow exists. */
export type ProfileStackParamList = {
  ProfileMain: undefined;
};
