import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stable persistence key for Search recent terms (PSD-Search §2.2).
 * Not a secret — scoped app id + feature + version for future migrations.
 */
export const RECENT_SEARCHES_STORAGE_KEY = 'movielist.recent_searches.v1' as const;

const MAX_RECENT_SEARCHES = 5;

/** Shared with Search hook so debounced query matches persisted recent terms. */
export function normalizeSearchTerm(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

/**
 * Loads persisted recent search strings, newest-first.
 * Returns an empty array when the key is missing, corrupt, or not a string array (never throws).
 */
export async function getRecentSearches(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (raw == null || raw.length === 0) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const out: string[] = [];
    for (const entry of parsed) {
      if (typeof entry === 'string') {
        out.push(entry);
      }
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Records a completed search term: trims and collapses inner whitespace; skips empty results.
 * Duplicates are removed from their old position and the term is prepended (newest-first).
 * List is capped at {@link MAX_RECENT_SEARCHES} after insert.
 */
export async function addRecentSearch(term: string): Promise<void> {
  const normalized = normalizeSearchTerm(term);
  if (normalized.length === 0) {
    return;
  }

  const current = await getRecentSearches();
  const withoutDup = current.filter((t) => t !== normalized);
  const next = [normalized, ...withoutDup].slice(0, MAX_RECENT_SEARCHES);
  await AsyncStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(next));
}

/** Removes all persisted recent searches for this feature. */
export async function clearRecentSearches(): Promise<void> {
  await AsyncStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
}
