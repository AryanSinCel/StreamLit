/**
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  RECENT_SEARCHES_STORAGE_KEY,
} from '../src/utils/recentSearches';

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

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('recentSearches', () => {
  it('getRecentSearches returns [] when empty', async () => {
    await expect(getRecentSearches()).resolves.toEqual([]);
  });

  it('addRecentSearch prepends and getRecentSearches reads back', async () => {
    await addRecentSearch('blade runner');
    await expect(getRecentSearches()).resolves.toEqual(['blade runner']);
  });

  it('trims and collapses whitespace; skips empty', async () => {
    await addRecentSearch('  hello   world  ');
    await expect(getRecentSearches()).resolves.toEqual(['hello world']);
    await addRecentSearch('   \n\t  ');
    await expect(getRecentSearches()).resolves.toEqual(['hello world']);
  });

  it('dedupes by moving repeat to newest-first', async () => {
    await addRecentSearch('a');
    await addRecentSearch('b');
    await addRecentSearch('c');
    await addRecentSearch('a');
    await expect(getRecentSearches()).resolves.toEqual(['a', 'c', 'b']);
  });

  it('caps at 5 entries', async () => {
    await addRecentSearch('1');
    await addRecentSearch('2');
    await addRecentSearch('3');
    await addRecentSearch('4');
    await addRecentSearch('5');
    await addRecentSearch('6');
    await expect(getRecentSearches()).resolves.toEqual(['6', '5', '4', '3', '2']);
  });

  it('clearRecentSearches removes persisted list', async () => {
    await addRecentSearch('x');
    await clearRecentSearches();
    await expect(getRecentSearches()).resolves.toEqual([]);
  });

  it('getRecentSearches returns [] on invalid JSON without throwing', async () => {
    await AsyncStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, '{not json');
    await expect(getRecentSearches()).resolves.toEqual([]);
  });

  it('getRecentSearches filters non-string entries and keeps valid strings', async () => {
    await AsyncStorage.setItem(
      RECENT_SEARCHES_STORAGE_KEY,
      JSON.stringify(['ok', 1, null, 'also']),
    );
    await expect(getRecentSearches()).resolves.toEqual(['ok', 'also']);
  });
});
