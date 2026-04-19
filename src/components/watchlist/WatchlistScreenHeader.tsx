/**
 * Shared Watchlist main header — PSD-Watchlist §3 / §5 (collection label, title, optional count line, actions, optional chips).
 */

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { WatchlistMediaFilter } from '../../api/types';
import { IconPerson, IconSearch } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { fill, layout, opacity, radiusCardOuter, spacing, tracking } from '../../theme/spacing';
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
  /** Merged after `headerBlock` (e.g. editorial spacing on empty watchlist). */
  style?: StyleProp<ViewStyle>;
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
  style,
}: WatchlistScreenHeaderProps): JSX.Element {
  const handleProfile = (): void => {
    if (onPressProfile != null) {
      onPressProfile();
      return;
    }
    Alert.alert('Profile', 'Coming soon', [{ text: 'OK' }]);
  };

  return (
    <View style={[styles.headerBlock, style]}>
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
        <View style={styles.chipTray}>
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
    gap: fill.none,
    marginBottom: spacing.xl,
  },
  headerTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerTitles: {
    flex: 1,
  },
  collectionLabel: {
    ...typography['label-sm'],
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: tracking.wide12,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  screenTitle: {
    ...typography['watchlist-screen-title'],
    color: colors.on_surface,
  },
  countLine: {
    ...typography['watchlist-count-line'],
    color: colors.on_surface_variant,
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
    opacity: opacity.pressed,
  },
  chip: {
    borderRadius: layout.chipRadiusSm,
    paddingHorizontal: spacing.lg + spacing.xs,
    paddingVertical: spacing.sm,
  },
  /** Inset tray — inactive chips stay transparent (`watchlist.png`). */
  chipIdle: {
    backgroundColor: 'transparent',
  },
  chipLabel: {
    ...typography['title-sm'],
    fontWeight: '600',
  },
  chipLabelIdle: {
    color: colors.on_surface,
  },
  chipLabelSelected: {
    color: colors.on_surface,
  },
  chipPressed: {
    opacity: opacity.control,
  },
  chipSelected: {
    backgroundColor: colors.secondary_container,
  },
  chipTray: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface_container_high,
    borderRadius: radiusCardOuter,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg + spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
