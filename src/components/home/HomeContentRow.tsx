/**
 * Section title + See All + horizontal poster strip (PSD-Home §5).
 */

import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ContentCard } from '../common/ContentCard';
import { colors } from '../../theme/colors';
import { homeRowCardWidth, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { MockPosterCard } from './homeStatic';

export type HomeContentRowProps = {
  sectionTitle: string;
  cards: readonly MockPosterCard[];
  onSeeAll: () => void;
  onOpenDetail: (movieId: number) => void;
};

export function HomeContentRow({
  sectionTitle,
  cards,
  onSeeAll,
  onOpenDetail,
}: HomeContentRowProps): JSX.Element {
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <Pressable accessibilityLabel={`See all ${sectionTitle}`} accessibilityRole="button" onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.rowScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rowScrollHost}
      >
        {cards.map((item) => (
          <ContentCard
            key={item.id}
            onPress={() => {
              onOpenDetail(item.id);
            }}
            posterUri={item.posterUri}
            style={styles.card}
            subtitle={item.subtitle}
            title={item.title}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.xxxxl,
  },
  /** Avoid platform default tint behind posters (`resources/home.png`). */
  rowScrollHost: {
    backgroundColor: colors.surface,
  },
  card: {
    marginRight: spacing.xxl,
    width: homeRowCardWidth,
  },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  rowScroll: {
    paddingHorizontal: spacing.xxl,
  },
  sectionTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    flex: 1,
    marginRight: spacing.md,
  },
  seeAll: {
    ...typography['title-sm'],
    color: colors.on_surface_variant,
    fontWeight: '600',
  },
});
