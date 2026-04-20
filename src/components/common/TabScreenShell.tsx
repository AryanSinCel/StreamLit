/**
 * Shared tab screen layout: surface root + elevated top dock with safe-area top inset.
 */

import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { elevation, spacing } from '../../theme/spacing';

export type TabScreenShellProps = {
  /** Top bar row only — typically **`TabAppBar`**. */
  topBar: ReactNode;
  children?: ReactNode;
  /** Optional override on the outer screen root (default: flex 1 + surface). */
  style?: StyleProp<ViewStyle>;
};

export function TabScreenShell({ topBar, children, style }: TabScreenShellProps): JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, style]}>
      <View style={[styles.headerDock, { paddingTop: insets.top + spacing.sm }]}>
        {topBar}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  headerDock: {
    backgroundColor: colors.surface,
    zIndex: elevation.dock,
  },
  screen: {
    backgroundColor: colors.surface,
    flex: 1,
  },
});
