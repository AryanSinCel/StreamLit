/**
 * Shared tab top app bar — brand row + optional end slot (`resources/home.html` TopAppBar,
 * `search.html`, `watchlist-empty.html`). Single implementation for all main tabs.
 */

import type { JSX, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconMovie, IconPerson } from './SimpleIcons';
import { colors } from '../../theme/colors';
import { layout, opacity, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const LOGO_ICON_COLOR = colors.on_surface_variant;

export type TabAppBarProps = {
  /**
   * Full right-side region. When set, **`beforeProfile`** / **`onPressProfile`** are ignored
   * (e.g. Home **Notifications** only).
   */
  trailing?: ReactNode;
  /** Extra control before the profile affordance — e.g. Search icon on Watchlist / Profile. */
  beforeProfile?: ReactNode;
  /** When set, profile avatar is tappable (Watchlist / Profile). */
  onPressProfile?: () => void;
  /**
   * `true` — coral wordmark (`search.html`).\
   * `false` — `on_surface` wordmark.
   */
  brandWordmark?: boolean;
  /** Profile / marketing — all-caps wordmark. */
  uppercaseWordmark?: boolean;
  /**
   * **`home`** — wordmark `primary_container` (Home tab PSD).\
   * **`tab`** — wordmark follows **`brandWordmark`** (coral vs on-surface).
   */
  brandVariant?: 'home' | 'tab';
};

export function TabAppBar({
  trailing,
  beforeProfile,
  onPressProfile,
  brandWordmark = true,
  uppercaseWordmark = false,
  brandVariant = 'tab',
}: TabAppBarProps): JSX.Element {
  const wordmarkStyle =
    brandVariant === 'home'
      ? styles.wordmarkHome
      : brandWordmark
        ? styles.wordmarkBrand
        : styles.wordmarkOnSurface;

  const avatarShell = (
    <View style={styles.avatar}>
      <IconPerson color={colors.on_surface_variant} size={22} />
    </View>
  );

  const end =
    trailing != null ? (
      trailing
    ) : (
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
    );

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <IconMovie color={LOGO_ICON_COLOR} size={26} />
        <Text style={[styles.wordmarkBase, wordmarkStyle, uppercaseWordmark && styles.wordmarkUpper]}>
          StreamList
        </Text>
      </View>
      {end}
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
    borderWidth: layout.borderSm,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    overflow: 'hidden',
    width: AVATAR_SIZE,
  },
  avatarPressed: {
    opacity: opacity.control,
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
  wordmarkHome: {
    color: colors.primary_container,
  },
  wordmarkOnSurface: {
    color: colors.on_surface,
  },
  wordmarkUpper: {
    textTransform: 'uppercase',
  },
});
