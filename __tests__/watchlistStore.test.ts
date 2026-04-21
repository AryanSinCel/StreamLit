/**
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWatchlistStore } from '../src/store/watchlistStore';

jest.mock('@react-native-async-storage/async-storage', () => {
  const memory = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: async (key: string) => memory.get(key) ?? null,
      setItem: async (key: string, value: string) => {
        memory.set(key, value);
      },
      removeItem: async (key: string) => {
        memory.delete(key);
      },
      clear: async () => {
        memory.clear();
      },
    },
  };
});

const sampleItem = {
  id: 1,
  title: 'Test',
  posterPath: null as string | null,
  voteAverage: 8,
  releaseDate: '2020-01-01',
  genreIds: [] as number[],
  mediaType: 'movie' as const,
};

beforeEach(async () => {
  await AsyncStorage.clear();
  useWatchlistStore.setState({ items: [], count: 0, hydrated: false, persistWriteError: null });
  await useWatchlistStore.persist.rehydrate();
});

describe('watchlistStore', () => {
  it('adds item and increments count', () => {
    useWatchlistStore.getState().addItem(sampleItem);
    expect(useWatchlistStore.getState().items).toHaveLength(1);
    expect(useWatchlistStore.getState().count).toBe(1);
  });

  it('prepends new items so the latest add is first', () => {
    const first = { ...sampleItem, id: 1, title: 'First' };
    const second = { ...sampleItem, id: 2, title: 'Second' };
    useWatchlistStore.getState().addItem(first);
    useWatchlistStore.getState().addItem(second);
    expect(useWatchlistStore.getState().items.map((i) => i.id)).toEqual([2, 1]);
  });

  it('ignores duplicate id on addItem', () => {
    useWatchlistStore.getState().addItem(sampleItem);
    useWatchlistStore.getState().addItem(sampleItem);
    expect(useWatchlistStore.getState().items).toHaveLength(1);
    expect(useWatchlistStore.getState().count).toBe(1);
  });

  it('removeItem removes by id', () => {
    useWatchlistStore.getState().addItem(sampleItem);
    useWatchlistStore.getState().removeItem(1);
    expect(useWatchlistStore.getState().items).toHaveLength(0);
    expect(useWatchlistStore.getState().count).toBe(0);
  });

  it('removeItem is no-op when id missing', () => {
    useWatchlistStore.getState().addItem(sampleItem);
    useWatchlistStore.getState().removeItem(999);
    expect(useWatchlistStore.getState().items).toHaveLength(1);
  });

  it('isInWatchlist reflects items', () => {
    expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(false);
    useWatchlistStore.getState().addItem(sampleItem);
    expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(true);
  });

  it('sets hydrated true after rehydrate', async () => {
    expect(useWatchlistStore.getState().hydrated).toBe(true);
  });

  it('migrates persisted v0 append order to newest-first on rehydrate', async () => {
    await AsyncStorage.clear();
    useWatchlistStore.setState({ items: [], count: 0, hydrated: false, persistWriteError: null });
    const older = { ...sampleItem, id: 1, title: 'Older' };
    const newer = { ...sampleItem, id: 2, title: 'Newer' };
    /** Seed after `setState` — persist `setItem` would otherwise overwrite the v0 payload. */
    await AsyncStorage.setItem(
      'movielist-watchlist',
      JSON.stringify({ state: { items: [older, newer] }, version: 0 }),
    );
    await useWatchlistStore.persist.rehydrate();
    expect(useWatchlistStore.getState().items.map((i) => i.id)).toEqual([2, 1]);
  });
});
