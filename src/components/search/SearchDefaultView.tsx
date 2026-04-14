/**
 * Search tab default (idle) body — `resources/search.html` / PSD-Search §3 (S4a, no API).
 */

import type { JSX } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { IconHistory, IconMovie, IconSearch, IconStar } from '../common/SimpleIcons';
import { colors, contentCard } from '../../theme/colors';
import {
  radiusCardInner,
  radiusCardOuter,
  radiusFullPill,
  spacing,
  searchFeaturedHeroAspectRatio,
} from '../../theme/spacing';
import { typography } from '../../theme/typography';
import {
  MOCK_GENRE_LABELS,
  MOCK_TRENDING_FEATURED,
  MOCK_TRENDING_GRID,
  SEARCH_INPUT_PLACEHOLDER,
} from './searchDefaultMocks';

export type SearchDefaultViewProps = {
  query: string;
  onChangeQuery: (value: string) => void;
  inputFocused: boolean;
  onFocusInput: () => void;
  onBlurInput: () => void;
  selectedGenreIndex: number;
  onSelectGenreIndex: (index: number) => void;
  recentItems: readonly string[];
  onClearRecents: () => void;
  showRecentsBlock: boolean;
};

export function SearchDefaultView({
  query,
  onChangeQuery,
  inputFocused,
  onFocusInput,
  onBlurInput,
  selectedGenreIndex,
  onSelectGenreIndex,
  recentItems,
  onClearRecents,
  showRecentsBlock,
}: SearchDefaultViewProps): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = spacing.xl;
  const gridGutter = spacing.md;
  const gridColWidth = (windowWidth - horizontalPad * 2 - gridGutter) / 2;

  return (
    <View style={styles.body}>
      <View style={styles.searchRow}>
        <View style={styles.searchIconWrap} pointerEvents="none">
          <IconSearch color={colors.on_surface_variant} size={22} />
        </View>
        <TextInput
          accessibilityLabel="Search movies, actors, directors"
          autoCapitalize="none"
          autoCorrect={false}
          onBlur={onBlurInput}
          onChangeText={onChangeQuery}
          onFocus={onFocusInput}
          placeholder={SEARCH_INPUT_PLACEHOLDER}
          placeholderTextColor={colors.search_placeholder}
          style={[styles.searchInput, inputFocused && styles.searchInputFocused]}
          value={query}
        />
      </View>

      <View style={styles.section}>
        <ScrollView
          contentContainerStyle={styles.chipsScrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {MOCK_GENRE_LABELS.map((label, index) => {
            const selected = index === selectedGenreIndex;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={label}
                onPress={() => onSelectGenreIndex(index)}
                style={({ pressed }) => [
                  styles.chip,
                  selected ? styles.chipSelected : styles.chipIdle,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={[styles.chipLabel, selected ? styles.chipLabelSelected : styles.chipLabelIdle]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {showRecentsBlock ? (
        <View style={styles.section}>
          <View style={styles.recentHeaderRow}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all recent searches"
              hitSlop={spacing.sm}
              onPress={onClearRecents}
            >
              <Text style={styles.clearAll}>Clear All</Text>
            </Pressable>
          </View>
          <View style={styles.recentList}>
            {recentItems.map((term) => (
              <View key={term} style={styles.recentRow}>
                <View style={styles.recentLeft}>
                  <IconHistory color={colors.on_surface_variant} size={22} />
                  <Text style={styles.recentTerm}>{term}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.sectionLast}>
        <Text style={styles.sectionTitle}>Trending Now</Text>

        <View style={styles.featuredWrap}>
          <View style={styles.featuredCard}>
            <View style={styles.featuredPosterPlaceholder}>
              <IconMovie color={colors.on_surface_variant} size={56} />
            </View>
            <View style={styles.featuredScrim} pointerEvents="none" />
            <View style={styles.featuredTextBlock}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeLabel}>Featured</Text>
              </View>
              <Text style={styles.featuredTitle}>{MOCK_TRENDING_FEATURED.title}</Text>
              <Text style={styles.featuredMeta}>{MOCK_TRENDING_FEATURED.metadataLine}</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridRow}>
          {MOCK_TRENDING_GRID.slice(0, 2).map((item) => (
            <View key={item.id} style={[styles.gridCell, { width: gridColWidth }]}>
              <TrendingMiniCard item={item} />
            </View>
          ))}
        </View>
        {MOCK_TRENDING_GRID.length > 2 ? (
          <View style={styles.gridRow}>
            <View style={[styles.gridCell, { width: gridColWidth }]}>
              <TrendingMiniCard item={MOCK_TRENDING_GRID[2]} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function TrendingMiniCard({
  item,
}: {
  item: (typeof MOCK_TRENDING_GRID)[number];
}): JSX.Element {
  return (
    <View style={styles.miniCard}>
      <View style={styles.miniPoster}>
        <View style={styles.miniPosterInner}>
          <IconMovie color={colors.on_surface_variant} size={40} />
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingValue}>{item.ratingLabel}</Text>
          <IconStar color={colors.primary_container} size={12} />
        </View>
      </View>
      <Text numberOfLines={1} style={styles.miniTitle}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={styles.miniSubtitle}>
        {item.genreLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  chip: {
    borderRadius: radiusFullPill,
    marginRight: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + spacing.xs,
  },
  chipIdle: {
    backgroundColor: colors.surface_container_highest,
  },
  chipLabel: {
    ...typography['title-sm'],
  },
  chipLabelIdle: {
    color: colors.on_surface_variant,
  },
  chipLabelSelected: {
    color: colors.on_surface,
    fontWeight: '600',
  },
  chipPressed: {
    opacity: 0.88,
  },
  chipSelected: {
    backgroundColor: colors.secondary_container,
  },
  chipsScrollContent: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    paddingRight: spacing.xl,
  },
  clearAll: {
    ...typography['title-sm'],
    color: colors.primary_container,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary_container,
    borderRadius: spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featuredBadgeLabel: {
    ...typography['tab-label'],
    color: colors.on_surface,
    letterSpacing: 2.5,
  },
  featuredCard: {
    aspectRatio: searchFeaturedHeroAspectRatio,
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  featuredMeta: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  featuredPosterPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    justifyContent: 'center',
  },
  featuredScrim: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: '40%',
    backgroundColor: colors.surface_container_lowest,
    opacity: 0.88,
  },
  featuredTextBlock: {
    bottom: 0,
    left: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    position: 'absolute',
    right: 0,
  },
  featuredTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    textShadowColor: colors.hero_text_shadow,
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 6,
  },
  featuredWrap: {
    alignSelf: 'stretch',
    marginBottom: spacing.xl,
    width: '100%',
  },
  gridCell: {
    marginBottom: spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'flex-start',
  },
  miniCard: {
    gap: spacing.md,
  },
  miniPoster: {
    aspectRatio: contentCard.aspectRatio,
    borderRadius: radiusCardOuter,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  miniPosterInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    margin: spacing.xs,
  },
  miniSubtitle: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  miniTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },
  ratingBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
  ratingValue: {
    ...typography['tab-label'],
    color: colors.on_surface,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'none',
  },
  recentHeaderRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  recentTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
  },
  recentLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  recentList: {
    gap: spacing.xs,
  },
  recentRow: {
    borderRadius: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  recentTerm: {
    ...typography['body-md'],
    color: colors.on_surface,
  },
  searchIconWrap: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: spacing.md,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: spacing.xxl,
    zIndex: 1,
  },
  searchInput: {
    ...typography['body-md'],
    backgroundColor: colors.surface_container_low,
    borderColor: 'transparent',
    borderRadius: spacing.md,
    borderWidth: 2,
    color: colors.on_surface,
    flex: 1,
    minHeight: spacing.xxxxl,
    paddingLeft: spacing.xxxxl + spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.md,
  },
  searchInputFocused: {
    borderColor: colors.outline_variant,
  },
  searchRow: {
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionLast: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: spacing.xl,
  },
});
