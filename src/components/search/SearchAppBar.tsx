/**
 * Search tab app bar — `resources/search.html` TopAppBar (wordmark + avatar placeholder).
 */

import type { JSX } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconMovie, IconPerson } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function SearchAppBar(): JSX.Element {
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <IconMovie color={colors.brand_coral} size={26} />
        <Text style={styles.wordmark}>StreamList</Text>
      </View>
      <View accessibilityLabel="Profile placeholder" style={styles.avatar}>
        <IconPerson color={colors.on_surface_variant} size={22} />
      </View>
    </View>
  );
}

const AVATAR_SIZE = spacing.xxxl;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderColor: colors.outline_variant,
    borderRadius: AVATAR_RADIUS,
    borderWidth: 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    overflow: 'hidden',
    width: AVATAR_SIZE,
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: spacing.xxxxl + spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  /** `search_default.png`: coral mark + **white** wordmark (not full coral lockup). */
  wordmark: {
    ...typography['brand-wordmark'],
    color: colors.on_surface,
  },
});
