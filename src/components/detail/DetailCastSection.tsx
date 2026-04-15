/**
 * Cast row — binds to **`credits`** hook section (PSD-Detail §2.1–2.2, §3–4).
 */

import type { JSX } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TmdbMovieCastCredit } from '../../api/types';
import { ShimmerBox } from '../common/ShimmerBox';
import { colors } from '../../theme/colors';
import { detailCastAvatarSize, spacing } from '../../theme/spacing';
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

/** Drops rows with no usable name so “empty” handling matches §3 “unusable” credits. */
function usableCastEntries(cast: TmdbMovieCastCredit[] | null): TmdbMovieCastCredit[] {
  if (cast == null) {
    return [];
  }
  return cast.filter((c) => typeof c.name === 'string' && c.name.trim().length > 0);
}

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

const AVATAR_STYLE = {
  borderRadius: detailCastAvatarSize / 2,
  height: detailCastAvatarSize,
  width: detailCastAvatarSize,
} as const;

const styles = StyleSheet.create({
  avatar: {
    ...AVATAR_STYLE,
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    justifyContent: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  avatarShim: {
    borderRadius: detailCastAvatarSize / 2,
    height: detailCastAvatarSize,
    width: detailCastAvatarSize,
  },
  block: {
    marginTop: spacing.xl,
  },
  castCell: {
    maxWidth: detailCastAvatarSize + spacing.xl,
    width: detailCastAvatarSize + spacing.sm,
  },
  castCharacter: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  castName: {
    ...typography['label-sm'],
    color: colors.on_surface,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  heading: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: spacing.sm,
  },
  headingShim: {
    borderRadius: spacing.xs,
    height: 28,
    marginBottom: spacing.sm,
    width: 120,
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
