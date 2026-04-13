/** Typed route params — extend when navigators are wired (Task 6+). */

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { movieId: number };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: { movieId: number };
};

export type WatchlistStackParamList = {
  WatchlistMain: undefined;
  Detail: { movieId: number };
};
