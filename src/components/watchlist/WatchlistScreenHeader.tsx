/**
 * Shared Watchlist main header — PSD-Watchlist §3 / §5 (collection label, title, optional count line, actions, optional chips).
 */

import type { JSX } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { WatchlistMediaFilter } from '../../api/types';
import { IconPerson, IconSearch } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { radiusFullPill, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type WatchlistScreenHeaderProps = {
  /** When set, shown under the main title in `on_surface_variant` (e.g. §5 **0 titles**). */
  countLine?: string;
  showChips: boolean;
  filter: WatchlistMediaFilter;
  setFilter: (f: WatchlistMediaFilter) => void;
  /** PSD §6 — profile control; defaults to a brief “Coming soon” alert. */
  onPressProfile?: () => void;
  /** Default **YOUR COLLECTION** — override for other tabs (e.g. Profile **YOUR ACCOUNT**). */
  sectionLabel?: string;
  /** Default **My Watchlist** — override for other screens (e.g. **Profile**). */
  mainTitle?: string;
  /**
   * When `false`, hides inline search/profile — use with `SearchAppBar` (`watchlist-empty.html` / Search tab).
   * @default true
   */
  showTopActions?: boolean;
};

const FILTER_CHIPS: readonly { key: WatchlistMediaFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movie', label: 'Movies' },
  { key: 'tv', label: 'Series' },
] as const;

export function WatchlistScreenHeader({
  countLine,
  showChips,
  filter,
  setFilter,
  onPressProfile,
  showTopActions = true,
  sectionLabel = 'YOUR COLLECTION',
  mainTitle = 'My Watchlist',
}: WatchlistScreenHeaderProps): JSX.Element {
  const handleProfile = (): void => {
    if (onPressProfile != null) {
      onPressProfile();
      return;
    }
    Alert.alert('Profile', 'Coming soon', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.headerBlock}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerTitles}>
          <Text style={styles.collectionLabel}>{sectionLabel}</Text>
          <Text style={styles.screenTitle}>{mainTitle}</Text>
          {countLine != null && countLine.length > 0 ? (
            <Text style={styles.countLine}>{countLine}</Text>
          ) : null}
        </View>
        {showTopActions ? (
          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel="Search"
              accessibilityRole="button"
              hitSlop={spacing.sm}
              onPress={() => {
                /* placeholder — PSD §3 */
              }}
              style={({ pressed }) => [styles.iconHit, pressed && styles.iconHitPressed]}
            >
              <IconSearch color={colors.on_surface_variant} size={22} />
            </Pressable>
            <Pressable
              accessibilityLabel="Profile"
              accessibilityRole="button"
              hitSlop={spacing.sm}
              onPress={handleProfile}
              style={({ pressed }) => [styles.iconHit, pressed && styles.iconHitPressed]}
            >
              <IconPerson color={colors.on_surface_variant} size={22} />
            </Pressable>
          </View>
        ) : null}
      </View>
      {showChips ? (
        <View style={styles.chipsRow}>
          {FILTER_CHIPS.map((chip) => {
            const selected = filter === chip.key;
            return (
              <Pressable
                key={chip.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setFilter(chip.key);
                }}
                style={({ pressed }) => [
                  styles.chip,
                  selected ? styles.chipSelected : styles.chipIdle,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    selected ? styles.chipLabelSelected : styles.chipLabelIdle,
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerTitles: {
    flex: 1,
    gap: spacing.xs,
  },
  collectionLabel: {
    ...typography['label-sm'],
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  screenTitle: {
    ...typography['display-md'],
    color: colors.on_surface,
  },
  countLine: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  iconHit: {
    padding: spacing.xs,
  },
  iconHitPressed: {
    opacity: 0.85,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  chip: {
    borderRadius: radiusFullPill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + spacing.xs,
  },
  chipIdle: {
    backgroundColor: colors.surface_container_highest,
  },
  chipSelected: {
    backgroundColor: colors.secondary_container,
  },
  chipPressed: {
    opacity: 0.88,
  },
  chipLabel: {
    ...typography['title-sm'],
  },
  chipLabelIdle: {
    color: colors.on_surface_variant,
  },
  chipLabelSelected: {
    color: colors.on_surface,
    fontWeight: '600',
  },
});
