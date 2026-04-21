import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useCallback, useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { WatchlistMediaFilter } from '../api/types';
import { IconPerson, IconSearch } from '../components/common/SimpleIcons';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { TabScreenShell } from '../components/common/TabScreenShell';
import { TabAppBar } from '../components/common/TabAppBar';
import { WatchlistScreenHeader } from '../components/watchlist/WatchlistScreenHeader';
import type { ProfileStackParamList, RootStackParamList, RootTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout, opacity, radiusCardInner, spacing, tracking } from '../theme/spacing';
import { useTabScreenScrollBottomPadding } from '../utils/tabBarScrollInset';
import { typography } from '../theme/typography';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Profile'>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

const AVATAR_DIAMETER = spacing.xxxxl + spacing.xxxl;
const AVATAR_ICON_SIZE = spacing.xxxl + spacing.md;

const PLACEHOLDER_NAME = 'Alex Rivera';
const PLACEHOLDER_EMAIL = 'alex.rivera@email.com';

/** Grouped rows — typical profile surface (no backend). */
const PROFILE_MENU_GROUPS = [
  {
    kicker: 'Account',
    items: ['Account settings', 'Password & security'] as const,
  },
  {
    kicker: 'Preferences',
    items: ['Notifications', 'Playback & download', 'Appearance'] as const,
  },
  {
    kicker: 'Support',
    items: ['Help center', 'Send feedback'] as const,
  },
  {
    kicker: 'About',
    items: ['Terms of use', 'Privacy policy'] as const,
  },
] as const;

const APP_VERSION_LABEL = 'MovieList 0.0.1';

/**
 * Profile tab — same **`TabAppBar`** dock as Watchlist; **`WatchlistScreenHeader`** title block (custom labels); placeholder account UI.
 */
export function ProfileScreen({ navigation }: Props): JSX.Element {
  const scrollBottomPadding = useTabScreenScrollBottomPadding();

  const showComingSoon = useCallback(() => {
    Alert.alert('Profile', 'Coming soon', [{ text: 'OK' }]);
  }, []);

  const openSearchTab = useCallback(() => {
    navigation.navigate('Search', { screen: 'SearchMain' });
  }, [navigation]);

  const noopSetFilter = useCallback((_f: WatchlistMediaFilter) => {}, []);

  const retryProfileShell = useCallback(() => {
    /* Static profile — boundary reset only; no remote refetch. */
  }, []);

  const searchAppBarTrailing = useMemo(
    () => (
      <Pressable
        accessibilityLabel="Search"
        accessibilityRole="button"
        hitSlop={spacing.sm}
        onPress={openSearchTab}
        style={({ pressed }) => [styles.appBarIconHit, pressed && styles.appBarIconHitPressed]}
      >
        <IconSearch color={colors.on_surface_variant} size={22} />
      </Pressable>
    ),
    [openSearchTab],
  );

  return (
    <TabScreenShell
      topBar={<TabAppBar beforeProfile={searchAppBarTrailing} onPressProfile={showComingSoon} />}
    >
      <ScreenErrorBoundary onRetry={retryProfileShell} screenLabel="Profile" style={styles.scroll}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: scrollBottomPadding,
              paddingTop: spacing.lg,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollFill}
        >
        <View style={styles.body}>
          <WatchlistScreenHeader
            countLine="Signed in with placeholder data"
            filter="all"
            mainTitle="Profile"
            sectionLabel="YOUR ACCOUNT"
            setFilter={noopSetFilter}
            showChips={false}
            showTopActions={false}
          />

          <Pressable
            accessibilityHint="Opens profile photo when available"
            accessibilityLabel="Profile photo placeholder"
            accessibilityRole="button"
            onPress={showComingSoon}
            style={({ pressed }) => [styles.avatarWrap, pressed && styles.avatarWrapPressed]}
          >
            <View style={styles.avatarCircle}>
              <IconPerson color={colors.on_surface_variant} size={AVATAR_ICON_SIZE} />
            </View>
          </Pressable>

          <Text style={styles.displayName}>{PLACEHOLDER_NAME}</Text>
          <Text style={styles.email}>{PLACEHOLDER_EMAIL}</Text>

          <Pressable
            accessibilityLabel="Edit profile"
            accessibilityRole="button"
            onPress={showComingSoon}
            style={({ pressed }) => [styles.editProfileBtn, pressed && styles.editProfileBtnPressed]}
          >
            <Text style={styles.editProfileLabel}>Edit profile</Text>
          </Pressable>

          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Watched</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Lists</Text>
            </View>
          </View>

          {PROFILE_MENU_GROUPS.map((group) => (
            <View key={group.kicker} style={styles.menuGroup}>
              <Text style={styles.menuGroupKicker}>{group.kicker}</Text>
              {group.items.map((label) => (
                <Pressable
                  accessibilityLabel={`${label}, coming soon`}
                  accessibilityRole="button"
                  key={`${group.kicker}-${label}`}
                  onPress={showComingSoon}
                  style={({ pressed }) => [styles.settingsRow, pressed && styles.settingsRowPressed]}
                >
                  <Text style={styles.settingsLabel}>{label}</Text>
                  <Text style={styles.settingsChevron} accessibilityElementsHidden>
                    ›
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}

          <Pressable
            accessibilityLabel="Sign out, coming soon"
            accessibilityRole="button"
            onPress={showComingSoon}
            style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutBtnPressed]}
          >
            <Text style={styles.signOutLabel}>Sign out</Text>
          </Pressable>

          <Text style={styles.versionFoot}>{APP_VERSION_LABEL}</Text>
        </View>
        </ScrollView>
      </ScreenErrorBoundary>
    </TabScreenShell>
  );
}

const styles = StyleSheet.create({
  appBarIconHit: {
    padding: spacing.xs,
  },
  appBarIconHitPressed: {
    opacity: opacity.pressed,
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderColor: colors.outline_variant,
    borderRadius: AVATAR_DIAMETER / 2,
    borderWidth: layout.borderSm,
    height: AVATAR_DIAMETER,
    justifyContent: 'center',
    width: AVATAR_DIAMETER,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  avatarWrapPressed: {
    opacity: opacity.emphasis,
  },
  body: {
    paddingHorizontal: spacing.xl,
  },
  displayName: {
    ...typography['title-lg'],
    color: colors.on_surface,
    fontWeight: '700',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  editProfileBtn: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    borderRadius: radiusCardInner,
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  editProfileBtnPressed: {
    opacity: opacity.emphasis,
  },
  editProfileLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  email: {
    ...typography['body-md'],
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  menuGroup: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  menuGroupKicker: {
    ...typography['label-sm'],
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: tracking.wide12,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  scroll: {
    flex: 1,
  },
  scrollFill: {
    flex: 1,
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  settingsChevron: {
    ...typography['title-lg'],
    color: colors.on_surface_variant,
  },
  settingsLabel: {
    ...typography['title-sm'],
    color: colors.on_surface,
    fontWeight: '600',
  },
  settingsRow: {
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardInner,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingsRowPressed: {
    opacity: opacity.emphasis,
  },
  signOutBtn: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
  },
  signOutBtnPressed: {
    opacity: opacity.control,
  },
  signOutLabel: {
    ...typography['title-sm'],
    color: colors.primary_container,
    fontWeight: '700',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  statLabel: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
  },
  statValue: {
    ...typography['title-lg'],
    color: colors.on_surface,
    fontWeight: '700',
  },
  statsCard: {
    alignItems: 'stretch',
    backgroundColor: colors.surface_container_low,
    borderRadius: radiusCardInner,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  versionFoot: {
    ...typography['label-sm'],
    color: colors.on_surface_variant,
    marginTop: spacing.xxl,
    textAlign: 'center',
  },
});
