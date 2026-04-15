/**
 * Detail overlay bar — `movie-showDetail.html` (back + share, `text-on-surface`, circular hits).
 */

import type { JSX } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconArrowBack, IconShare } from '../common/SimpleIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const NAV_HIT = spacing.xxxl;

export type DetailNavBarProps = {
  onBack: () => void;
};

export function DetailNavBar({ onBack }: DetailNavBarProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.md }]} pointerEvents="box-none">
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={spacing.sm}
        onPress={onBack}
        style={({ pressed }) => [styles.hitCircle, pressed && styles.hitPressed]}
      >
        <IconArrowBack color={colors.on_surface} size={24} />
      </Pressable>
      <Pressable
        accessibilityHint="Sharing is not available yet"
        accessibilityLabel="Share"
        accessibilityRole="button"
        hitSlop={spacing.sm}
        onPress={() => {
          Alert.alert('Share', 'Coming soon', [{ text: 'OK' }]);
        }}
        style={({ pressed }) => [styles.hitCircle, pressed && styles.hitPressed]}
      >
        <IconShare color={colors.on_surface} size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 50,
  },
  hitCircle: {
    alignItems: 'center',
    height: NAV_HIT,
    justifyContent: 'center',
    width: NAV_HIT,
  },
  hitPressed: {
    opacity: 0.88,
  },
});
