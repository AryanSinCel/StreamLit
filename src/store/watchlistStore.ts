import type { WatchlistItem } from '../api/types';

/** Task 7: Zustand + `persist` + `hydrated` + AsyncStorage. */

export interface WatchlistStore {
  items: WatchlistItem[];
  addItem: (item: WatchlistItem) => void;
  removeItem: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  count: number;
  hydrated: boolean;
}

const noop = (): void => {};

export const watchlistStoreStub: WatchlistStore = {
  items: [],
  addItem: noop,
  removeItem: noop,
  isInWatchlist: () => false,
  count: 0,
  hydrated: false,
};
