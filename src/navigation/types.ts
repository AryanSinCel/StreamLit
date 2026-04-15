import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * “See All” list modes — `getTrendingMoviesWeek` | `getTopRatedMovies` | `getDiscoverMovies` |
 * `getSimilarMovies` (Watchlist “Because you saved” full list).
 */
export type SeeAllMode = 'trending' | 'top_rated' | 'discover' | 'similar';

export type SeeAllParams = {
  title: string;
  mode: SeeAllMode;
  genreId?: number;
  /** Required when `mode === 'similar'` — `GET /movie/{id}/similar` anchor. */
  similarSourceMovieId?: number;
};

/**
 * Root stack — **`Detail`** and **`SeeAll`** live here (above tabs) so the tab bar only shows on `MainTabs`.
 * `navigate` from a tab bubbles to this stack; **back** pops to `MainTabs` with the same tab still selected.
 */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  Detail: { movieId: number };
  SeeAll: SeeAllParams;
};

/** Bottom tabs — nested stack per tab (tab-only routes; no `Detail` / `SeeAll` — see `RootStackParamList`). */
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: NavigatorScreenParams<SearchStackParamList>;
  Watchlist: NavigatorScreenParams<WatchlistStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  HomeMain: undefined;
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
