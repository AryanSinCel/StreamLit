/**
 * Synopsis + Read more / Show less — PSD-Detail §4 (`primary_container` toggle).
 */

import type { JSX } from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type DetailSynopsisSectionProps = {
  overview: string | null;
};

export function DetailSynopsisSection({ overview }: DetailSynopsisSectionProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const text =
    overview != null && overview.trim().length > 0 ? overview.trim() : 'No synopsis available.';

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>Synopsis</Text>
      <Text numberOfLines={expanded ? undefined : 3} style={styles.body}>
        {text}
      </Text>
      {overview != null && overview.trim().length > 0 ? (
        <Pressable
          accessibilityHint={expanded ? 'Collapses synopsis to three lines' : 'Expands full synopsis'}
          accessibilityLabel={expanded ? 'Show less synopsis' : 'Read more synopsis'}
          accessibilityRole="button"
          onPress={() => {
            setExpanded((v) => !v);
          }}
          style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
        >
          <Text style={styles.toggleLabel}>{expanded ? 'Show less' : 'Read more'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  body: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  heading: {
    ...typography['headline-md'],
    color: colors.on_surface,
  },
  toggle: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  toggleLabel: {
    ...typography['label-sm'],
    color: colors.primary_container,
    fontWeight: '600',
  },
  togglePressed: {
    opacity: 0.88,
  },
});
