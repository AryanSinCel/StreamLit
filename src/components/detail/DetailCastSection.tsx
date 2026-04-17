/**
 * Cast row — `movie-showDetail.html` (`gap-6`, 64px avatars, ring, 11px / 10px labels).
 */

import type { JSX } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieCastCredit } from '../../api/types';
import { ShimmerBox } from '../common/ShimmerBox';
import { colors } from '../../theme/colors';
import { detailCastAvatarSize, layout, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { buildImageUrl, TMDB_IMAGE_SIZE_W185 } from '../../utils/image';
import { DetailSectionError } from './DetailSectionError';

export type DetailCastSectionProps = {
  loading: boolean;
  error: string | null;
  cast: TmdbMovieCastCredit[] | null;
  onRetry: () => void;
};

function sortTopBilled(cast: TmdbMovieCastCredit[]): TmdbMovieCastCredit[] {
  return [...cast].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).slice(0, 16);
}

function usableCastEntries(cast: TmdbMovieCastCredit[] | null): TmdbMovieCastCredit[] {
  if (cast == null) {
    return [];
  }
  return cast.filter((c) => typeof c.name === 'string' && c.name.trim().length > 0);
}

const AVATAR_RING = 2;

export function DetailCastSection({ loading, error, cast, onRetry }: DetailCastSectionProps): JSX.Element {
  if (loading && cast == null) {
    return (
      <View style={styles.block}>
        <ShimmerBox style={styles.headingShim} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.avatarRow}>
            {Array.from({ length: 6 }, (_, i) => (
              <ShimmerBox key={i} style={styles.avatarShim} />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error != null) {
    return (
      <View style={styles.block}>
        <Text style={styles.heading}>Cast</Text>
        <DetailSectionError
          message={error}
          onRetry={onRetry}
          retryAccessibilityLabel="Retry loading cast"
        />
      </View>
    );
  }

  const list = sortTopBilled(usableCastEntries(cast));
  if (list.length === 0) {
    return (
      <View style={styles.block}>
        <Text style={styles.unavailable}>Cast information unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>Cast</Text>
      <ScrollView horizontal contentContainerStyle={styles.avatarRow} showsHorizontalScrollIndicator={false}>
        {list.map((member) => {
          const uri = buildImageUrl(member.profile_path, TMDB_IMAGE_SIZE_W185);
          return (
            <View key={`${String(member.id)}-${member.credit_id ?? ''}`} style={styles.castCell}>
              {uri != null ? (
                <Image
                  accessibilityIgnoresInvertColors
                  accessibilityLabel={member.name}
                  resizeMode="cover"
                  source={{ uri }}
                  style={styles.avatar}
                />
              ) : (
                <View accessibilityLabel={`${member.name}, no photo`} style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.initials}>{member.name.trim().slice(0, 1).toUpperCase()}</Text>
                </View>
              )}
              <Text numberOfLines={2} style={styles.castName}>
                {member.name}
              </Text>
              <Text numberOfLines={2} style={styles.castCharacter}>
                {String(member.character ?? '').trim().length > 0 ? String(member.character) : '—'}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: colors.detail_cast_avatar_ring,
    borderRadius: detailCastAvatarSize / 2,
    borderWidth: AVATAR_RING,
    height: detailCastAvatarSize,
    width: detailCastAvatarSize,
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    justifyContent: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    paddingBottom: spacing.sm,
    paddingVertical: spacing.sm,
  },
  avatarShim: {
    borderRadius: detailCastAvatarSize / 2,
    height: detailCastAvatarSize,
    width: detailCastAvatarSize,
  },
  block: {
    marginTop: spacing.xxl,
  },
  castCell: {
    alignItems: 'center',
    maxWidth: detailCastAvatarSize + spacing.md,
    width: detailCastAvatarSize + spacing.sm,
  },
  castCharacter: {
    ...typography['detail-cast-role'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  castName: {
    ...typography['detail-cast-name'],
    color: colors.on_surface,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  heading: {
    ...typography['headline-search'],
    color: colors.on_surface,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  headingShim: {
    borderRadius: spacing.xs,
    height: layout.skeletonTextLine,
    marginBottom: spacing.lg,
    width: layout.skeletonPosterWide,
  },
  initials: {
    ...typography['title-lg'],
    color: colors.on_surface_variant,
  },
  unavailable: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginTop: spacing.sm,
  },
});
