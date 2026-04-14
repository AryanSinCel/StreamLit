/**
 * Primary-gradient CTA — `react-native-svg` only (no `react-native-linear-gradient` dep). PSD-Watchlist §5.
 */

import type { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors, primaryGradient } from '../../theme/colors';
import { radiusCardInner } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const CTA_HEIGHT = 52;
const GRADIENT_ID = 'watchlistBrowseTrendingCtaGrad';

export type WatchlistBrowseTrendingCtaProps = {
  width: number;
  onPress: () => void;
};

export function WatchlistBrowseTrendingCta({ width, onPress }: WatchlistBrowseTrendingCtaProps): JSX.Element {
  const w = Math.max(0, width);
  return (
    <Pressable
      accessibilityHint="Switches to the Home tab"
      accessibilityLabel="Browse Trending Now"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.hit, pressed && styles.hitPressed]}
    >
      <View style={[styles.clip, { borderRadius: radiusCardInner, width: w }]}>
        <Svg height={CTA_HEIGHT} width={w}>
          <Defs>
            <LinearGradient
              id={GRADIENT_ID}
              x1={primaryGradient.start.x}
              x2={primaryGradient.end.x}
              y1={primaryGradient.start.y}
              y2={primaryGradient.end.y}
            >
              <Stop offset="0" stopColor={primaryGradient.colors[0]} />
              <Stop offset="1" stopColor={primaryGradient.colors[1]} />
            </LinearGradient>
          </Defs>
          <Rect fill={`url(#${GRADIENT_ID})`} height={CTA_HEIGHT} rx={radiusCardInner} width={w} />
        </Svg>
        <Text style={styles.label}>Browse Trending Now</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignSelf: 'stretch',
  },
  hitPressed: {
    opacity: 0.92,
  },
  clip: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    ...typography['title-sm'],
    color: colors.on_primary_container,
    fontWeight: '700',
    position: 'absolute',
    textAlign: 'center',
  },
});
