import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WatchlistItem } from '../api/types';

export type { WatchlistItem } from '../api/types';

/** PSD §8 — persisted watchlist + hydration gate for UI. */
export interface WatchlistStore {
  items: WatchlistItem[];
  addItem: (item: WatchlistItem) => void;
  removeItem: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  count: number;
  hydrated: boolean;
}

const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      hydrated: false,
      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) {
            return state;
          }
          const items = [...state.items, item];
          return { items, count: items.length };
        });
      },
      removeItem: (id) => {
        set((state) => {
          if (!state.items.some((i) => i.id === id)) {
            return state;
          }
          const items = state.items.filter((i) => i.id !== id);
          return { items, count: items.length };
        });
      },
      isInWatchlist: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: 'movielist-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // Rehydration failed — empty list and lift gate so UI is not stuck.
          useWatchlistStore.setState({ items: [], count: 0, hydrated: true });
        } else {
          useWatchlistStore.setState((s) => ({
            count: s.items.length,
            hydrated: true,
          }));
        }
      },
    },
  ),
);

export { useWatchlistStore };
