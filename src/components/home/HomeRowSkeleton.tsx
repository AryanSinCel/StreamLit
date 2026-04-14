/**
 * Shape-matched row skeleton — poster strip matches `ContentCard` / Home row (PSD-Home H6).
 */

import type { JSX } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ShimmerBox } from '../common/ShimmerBox';
import { contentCard } from '../../theme/colors';
import { homeRowCardWidth, spacing } from '../../theme/spacing';

const CARD_COUNT = 5;
const posterHeight = homeRowCardWidth / contentCard.aspectRatio;

export function HomeRowSkeleton(): JSX.Element {
  return (
    <View style={styles.host} accessibilityLabel="Loading row">
      <ScrollView
        contentContainerStyle={styles.rowScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rowScrollHost}
      >
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <View key={i} style={styles.cardSlot}>
            <ShimmerBox style={styles.poster} />
            <ShimmerBox style={styles.titleLine} />
            <ShimmerBox style={styles.subLine} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSlot: {
    marginRight: spacing.xxl,
    width: homeRowCardWidth,
  },
  host: {
    minHeight: posterHeight + spacing.sm + 14 + spacing.xs + 12,
  },
  poster: {
    borderRadius: contentCard.radiusInner,
    height: posterHeight,
    width: '100%',
  },
  rowScroll: {
    paddingHorizontal: spacing.xxl,
  },
  rowScrollHost: {
    flexGrow: 0,
  },
  subLine: {
    borderRadius: spacing.xs,
    height: 12,
    marginTop: spacing.xs,
    width: '70%',
  },
  titleLine: {
    borderRadius: spacing.xs,
    height: 14,
    marginTop: spacing.sm,
    width: '85%',
  },
});
