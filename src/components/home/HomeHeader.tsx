/**
 * Home top bar — wordmark + bell (`resources/home.html` TopAppBar).
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconMovie, IconNotifications } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function HomeHeader(): JSX.Element {
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <IconMovie color={colors.brand_coral} size={26} />
        <Text style={styles.wordmark}>StreamList</Text>
      </View>
      <Pressable
        accessibilityLabel="Notifications"
        accessibilityRole="button"
        hitSlop={spacing.md}
        onPress={() => {}}
        style={({ pressed }) => [styles.bellHit, pressed && styles.pressed]}
      >
        <IconNotifications color={colors.on_surface_variant} size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: spacing.xxxxl + spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  bellHit: {
    alignItems: 'center',
    borderRadius: spacing.xxxxl,
    justifyContent: 'center',
    padding: spacing.sm,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  wordmark: {
    ...typography['brand-wordmark'],
    color: colors.brand_coral,
  },
});
