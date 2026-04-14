/**
 * Featured hero — static backdrop + CTAs (PSD-Home §5; `resources/home.html`).
 */

import type { JSX } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconPlay } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { homeHeroHeight, radiusCardInner, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { HOME_HERO_BACKDROP_URI } from './homeStatic';

export type HomeHeroProps = {
  onWatchNow: () => void;
  onDetails: () => void;
};

const SYNOPSIS =
  'In a city that never sleeps, one driver must outrun the shadows of his past to secure a future he never thought possible.';

export function HomeHero({ onWatchNow, onDetails }: HomeHeroProps): JSX.Element {
  return (
    <View style={styles.wrap}>
      <View style={styles.shell}>
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel="Featured title backdrop"
          resizeMode="cover"
          source={{ uri: HOME_HERO_BACKDROP_URI }}
          style={styles.backdrop}
        />
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New Release</Text>
          </View>
          <Text style={styles.title}>Neon Drift</Text>
          <Text numberOfLines={2} style={styles.synopsis}>
            {SYNOPSIS}
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Watch now"
              accessibilityRole="button"
              onPress={onWatchNow}
              style={({ pressed }) => [styles.watchBtn, pressed && styles.pressed]}
            >
              <IconPlay color={colors.on_primary} size={20} />
              <Text style={styles.watchLabel}>Watch Now</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Details"
              accessibilityRole="button"
              onPress={onDetails}
              style={({ pressed }) => [styles.detailsBtn, pressed && styles.pressed]}
            >
              <Text style={styles.detailsLabel}>Details</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    borderRadius: spacing.xs,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography['label-sm'],
    color: colors.on_primary_container,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  content: {
    bottom: 0,
    justifyContent: 'flex-end',
    left: 0,
    padding: spacing.xl,
    position: 'absolute',
    right: 0,
  },
  detailsBtn: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 120,
    opacity: 0.88,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  detailsLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.88,
  },
  shell: {
    borderRadius: radiusCardInner,
    height: homeHeroHeight,
    overflow: 'hidden',
    width: '100%',
  },
  synopsis: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    maxWidth: 320,
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: spacing.xs, width: 0 },
    textShadowRadius: spacing.md,
  },
  title: {
    ...typography['display-md'],
    color: colors.on_surface,
    marginBottom: spacing.md,
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: spacing.xs, width: 0 },
    textShadowRadius: spacing.md,
    textTransform: 'uppercase',
  },
  watchBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  watchLabel: {
    ...typography['title-sm'],
    color: colors.on_primary,
    fontWeight: '700',
  },
  wrap: {
    marginBottom: spacing.xxxxl,
    paddingHorizontal: spacing.xxl,
  },
});
