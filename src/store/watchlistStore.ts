import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { StoreApi } from 'zustand';
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
  /** Set when AsyncStorage persist write fails after an optimistic change; cleared from UI. */
  persistWriteError: string | null;
  clearPersistWriteError: () => void;
}

type WatchlistStoreApi = StoreApi<WatchlistStore> & {
  persist: { rehydrate: () => Promise<void> };
};

/** Avoid TDZ: `setItem` runs after `create`, but must reference the store for rollback + rehydrate. */
const watchlistStoreRef: { current: WatchlistStoreApi | null } = { current: null };

const watchlistPersistStorage = createJSONStorage(() => ({
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      const api = watchlistStoreRef.current;
      if (api == null) {
        return;
      }
      let restored = false;
      try {
        const raw = await AsyncStorage.getItem(name);
        if (raw != null) {
          const parsed = JSON.parse(raw) as { state?: { items?: unknown } };
          const restoredItems = parsed.state?.items;
          if (Array.isArray(restoredItems)) {
            const items = restoredItems as WatchlistItem[];
            api.setState({
              items,
              count: items.length,
              persistWriteError: 'Could not save your watchlist. Restored the previous list.',
            });
            restored = true;
          }
        }
      } catch {
        /* ignore parse errors */
      }
      if (!restored) {
        api.setState({
          persistWriteError: 'Could not save your watchlist. Restored the previous list.',
        });
        try {
          await api.persist.rehydrate();
        } catch {
          /* rehydrate failure — surface error only */
        }
      }
    }
  },
  removeItem: (name) => AsyncStorage.removeItem(name),
}));

const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      hydrated: false,
      persistWriteError: null,
      clearPersistWriteError: () => {
        set({ persistWriteError: null });
      },
      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) {
            return state;
          }
          /** Newest first — grid row 1 shows the latest add (legacy v0 order was append). */
          const items = [item, ...state.items];
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
      storage: watchlistPersistStorage,
      partialize: (state) => ({ items: state.items }),
      /** v0: append order (oldest→newest). v1: reverse once on migrate, then `addItem` prepends. */
      version: 1,
      migrate: (persistedState, fromVersion) => {
        const s = persistedState as { items?: WatchlistItem[] };
        const raw = Array.isArray(s?.items) ? s.items : [];
        if (fromVersion === 0) {
          return { items: [...raw].reverse() };
        }
        return { items: raw };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // Rehydration failed — empty list and lift gate so UI is not stuck.
          useWatchlistStore.setState({ items: [], count: 0, hydrated: true, persistWriteError: null });
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

watchlistStoreRef.current = useWatchlistStore as WatchlistStoreApi;

export { useWatchlistStore };
