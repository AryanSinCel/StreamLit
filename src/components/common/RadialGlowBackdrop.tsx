/**
 * Soft radial highlight for empty states — matches `resources/watchlist-empty.html` glow.
 */

import type { JSX } from 'react';
import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../../theme/colors';

export type RadialGlowBackdropProps = {
  width: number;
  /** Vertical extent of the SVG glow canvas. */
  height?: number;
};

const DEFAULT_HEIGHT = 280;

export function RadialGlowBackdrop({ width, height = DEFAULT_HEIGHT }: RadialGlowBackdropProps): JSX.Element {
  const reactId = useId();
  const gradId = `radialGlow-${reactId.replace(/:/g, '')}`;
  const w = Math.max(1, width);
  const h = Math.max(1, height);

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Svg height={h} width={w}>
        <Defs>
          <RadialGradient cx="50%" cy="50%" id={gradId} r="55%">
            <Stop offset="0%" stopColor={colors.watchlist_empty_radial_glow} stopOpacity={1} />
            <Stop offset="70%" stopColor={colors.surface} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect fill={`url(#${gradId})`} height={h} width={w} x={0} y={0} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
