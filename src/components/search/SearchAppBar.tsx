/**
 * StreamList top app bar — `resources/search.html` (Search tab) and `resources/watchlist-empty.html` (Watchlist).
 */

import type { JSX, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconMovie, IconPerson } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type SearchAppBarProps = {
  /** Extra control before the profile affordance — e.g. Search icon on Watchlist (`watchlist-empty.html`). */
  beforeProfile?: ReactNode;
  /** When set, the avatar is tappable (Watchlist / future tabs). */
  onPressProfile?: () => void;
  /**
   * `true` — coral wordmark matching the clapperboard (`search.html`, `search-result.html`, Home).
   * `false` — `on_surface` wordmark (rare alternate layouts).
   */
  brandWordmark?: boolean;
  /** Profile / marketing screens — all-caps wordmark (e.g. **STREAMLIST**). */
  uppercaseWordmark?: boolean;
};

export function SearchAppBar({
  beforeProfile,
  onPressProfile,
  brandWordmark = true,
  uppercaseWordmark = false,
}: SearchAppBarProps): JSX.Element {
  const wordmarkStyle = brandWordmark ? styles.wordmarkBrand : styles.wordmarkOnSurface;

  const avatarShell = (
    <View style={styles.avatar}>
      <IconPerson color={colors.on_surface_variant} size={22} />
    </View>
  );

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <IconMovie color={colors.brand_coral} size={26} />
        <Text style={[styles.wordmarkBase, wordmarkStyle, uppercaseWordmark && styles.wordmarkUpper]}>
          StreamList
        </Text>
      </View>
      <View style={styles.end}>
        {beforeProfile != null ? <View style={styles.beforeProfile}>{beforeProfile}</View> : null}
        {onPressProfile != null ? (
          <Pressable
            accessibilityLabel="Profile"
            accessibilityRole="button"
            hitSlop={spacing.sm}
            onPress={onPressProfile}
            style={({ pressed }) => [pressed && styles.avatarPressed]}
          >
            {avatarShell}
          </Pressable>
        ) : (
          <View accessibilityLabel="Profile placeholder" accessibilityRole="image">
            {avatarShell}
          </View>
        )}
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
  avatarPressed: {
    opacity: 0.88,
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: spacing.xxxxl + spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  beforeProfile: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  end: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
  },
  wordmarkBase: {
    ...typography['brand-wordmark'],
  },
  wordmarkBrand: {
    color: colors.brand_coral,
  },
  wordmarkOnSurface: {
    color: colors.on_surface,
  },
  wordmarkUpper: {
    textTransform: 'uppercase',
  },
});
