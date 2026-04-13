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
