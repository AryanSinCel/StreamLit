/**
 * Horizontal genre chips — PSD-Home §4 (`resources/home.html`).
 */

import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { HomeChipKey, HomeChipResolved } from '../../api/types';
import { colors } from '../../theme/colors';
import { radiusFullPill, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type HomeGenreStripProps = {
  chips: readonly HomeChipResolved[];
  selectedKey: HomeChipKey;
  onSelect: (key: HomeChipKey) => void;
};

export function HomeGenreStrip({ chips, selectedKey, onSelect }: HomeGenreStripProps): JSX.Element {
  return (
    <View style={styles.wrap}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {chips.map((chip) => {
          const active = chip.key === selectedKey;
          const chipListKey = typeof chip.key === 'number' ? `genre-${chip.key}` : 'all';
          return (
            <Pressable
              key={chipListKey}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Filter ${chip.label}`}
              onPress={() => {
                onSelect(chip.key);
              }}
              style={({ pressed }) => [
                styles.chip,
                active ? styles.chipActive : styles.chipIdle,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{chip.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radiusFullPill,
    marginRight: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  chipActive: {
    backgroundColor: colors.secondary_container,
  },
  chipIdle: {
    backgroundColor: colors.surface_container_high,
  },
  chipLabel: {
    ...typography['title-sm'],
    color: colors.on_surface_variant,
  },
  chipLabelActive: {
    color: colors.on_surface,
  },
  chipPressed: {
    opacity: 0.9,
  },
  scroll: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xs,
  },
  wrap: {
    marginBottom: spacing.xxxl,
  },
});
