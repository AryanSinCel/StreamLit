/**
 * Recent searches block — PSD-Search §3; shared by default + results layouts.
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconHistory } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { opacity, spacing, tracking } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type SearchRecentSearchesSectionProps = {
  visible: boolean;
  recentSearches: readonly string[];
  onClearRecents: () => void;
  onRecentTermPress: (term: string) => void;
};

export function SearchRecentSearchesSection({
  visible,
  recentSearches,
  onClearRecents,
  onRecentTermPress,
}: SearchRecentSearchesSectionProps): JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.recentHeaderRow}>
        <Text style={styles.recentTitle}>Recent Searches</Text>
        <Pressable
          accessibilityLabel="Clear all recent searches"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onClearRecents}
        >
          <Text style={styles.clearAll}>Clear All</Text>
        </Pressable>
      </View>
      <View style={styles.recentList}>
        {recentSearches.map((term, index) => (
          <Pressable
            accessibilityRole="button"
            key={`${term}-${String(index)}`}
            onPress={() => onRecentTermPress(term)}
            style={({ pressed }) => [styles.recentRow, pressed && styles.recentRowPressed]}
          >
            <View style={styles.recentLeft}>
              <IconHistory color={colors.on_surface_variant} size={24} />
              <Text style={styles.recentTerm}>{term}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clearAll: {
    ...typography['label-sm'],
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: tracking.caps,
    textTransform: 'uppercase',
  },
  recentHeaderRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  recentLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  recentList: {
    gap: spacing.xs,
  },
  recentRow: {
    borderRadius: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  recentRowPressed: {
    opacity: opacity.control,
  },
  recentTerm: {
    ...typography['body-md'],
    color: colors.on_surface,
    fontWeight: '500',
  },
  recentTitle: {
    ...typography['headline-search'],
    color: colors.on_surface,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
});
