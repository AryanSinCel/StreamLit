/**
 * Theme-driven skeleton pulse — `skeletonShimmer` in `src/theme/colors.ts` (~1.5s loop).
 */

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { skeletonShimmer } from '../../theme/colors';

export type ShimmerBoxProps = {
  style?: StyleProp<ViewStyle>;
};

export function ShimmerBox({ style }: ShimmerBoxProps): JSX.Element {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: skeletonShimmer.durationMs / 2,
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: skeletonShimmer.durationMs / 2,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [pulse]);

  const backgroundColor = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [skeletonShimmer.baseColor, skeletonShimmer.highlightColor],
  });

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[style, { backgroundColor }]}
    />
  );
}
