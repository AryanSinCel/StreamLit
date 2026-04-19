/**
 * PSD §9.5 — centred StreamList wordmark, message, **Try Again** → hook **`refetch`** (or composite refetch).
 */

import { Component, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconMovie } from './SimpleIcons';
import { colors } from '../../theme/colors';
import { opacity, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type ScreenErrorBoundaryProps = {
  children: ReactNode;
  /** Hook **`refetch`** (or a thunk that refetches all sections). */
  onRetry: () => void;
  /** Optional screen title for a11y / copy. */
  screenLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type State = {
  hasError: boolean;
};

export class ScreenErrorBoundary extends Component<ScreenErrorBoundaryProps, State> {
  public state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    if (__DEV__) {
      console.error('[ScreenErrorBoundary]', error);
    }
  }

  private readonly handleRetry = (): void => {
    this.setState({ hasError: false });
    this.props.onRetry();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const label = this.props.screenLabel ?? 'This screen';
      return (
        <View style={[styles.wrap, this.props.style]} accessibilityRole="alert">
          <View accessibilityLabel="StreamList" accessible style={styles.brand}>
            <IconMovie color={colors.brand_coral} size={26} />
            <Text style={styles.wordmark}>StreamList</Text>
          </View>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>
            {label} hit an unexpected error. You can try loading again.
          </Text>
          <Pressable
            accessibilityLabel="Try Again"
            accessibilityRole="button"
            onPress={this.handleRetry}
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnLabel}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  body: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  brand: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  btn: {
    alignSelf: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  btnLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  btnPressed: {
    opacity: opacity.control,
  },
  title: {
    ...typography['headline-search'],
    color: colors.on_surface,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  wordmark: {
    ...typography['brand-wordmark'],
    color: colors.brand_coral,
  },
  wrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
  },
});
