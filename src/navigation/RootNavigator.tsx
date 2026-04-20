import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import {
  IconBookmark,
  IconHome,
  IconPerson,
  IconSearch,
} from '../components/common/SimpleIcons';
import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SeeAllScreen } from '../screens/SeeAllScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { TabBarGlassBackground } from './TabBarGlassBackground';
import { colors } from '../theme/colors';
import { elevation, fill, layout, opacity, radiusCardInner, spacing } from '../theme/spacing';
import { useWatchlistStore } from '../store/watchlistStore';
import { typography } from '../theme/typography';
import type {
  HomeStackParamList,
  ProfileStackParamList,
  RootStackParamList,
  RootTabParamList,
  SearchStackParamList,
  WatchlistStackParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const WatchlistStack = createNativeStackNavigator<WatchlistStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function renderTabBarGlassBackground() {
  return <TabBarGlassBackground />;
}

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface_container },
  headerTintColor: colors.on_surface,
  headerTitleStyle: { color: colors.on_surface },
  contentStyle: { backgroundColor: colors.surface },
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false, title: 'Home' }}
      />
    </HomeStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={stackScreenOptions}>
      <SearchStack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{ headerShown: false, title: 'Search' }}
      />
    </SearchStack.Navigator>
  );
}

function WatchlistStackNavigator() {
  return (
    <WatchlistStack.Navigator screenOptions={stackScreenOptions}>
      <WatchlistStack.Screen
        name="WatchlistMain"
        component={WatchlistScreen}
        options={{ headerShown: false, title: 'Watchlist' }}
      />
    </WatchlistStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false, title: 'Profile' }}
      />
    </ProfileStack.Navigator>
  );
}

const tabBarActiveTintColor = colors.primary_container;
const tabBarInactiveTintColor = colors.tab_icon_inactive;

function tabBarIconColor(focused: boolean): string {
  return focused ? colors.primary_container : colors.tab_icon_inactive;
}

const mainTabBarIconHome: NonNullable<BottomTabNavigationOptions['tabBarIcon']> = ({
  focused,
  size,
}) => <IconHome color={tabBarIconColor(focused)} size={size} />;

const mainTabBarIconSearch: NonNullable<BottomTabNavigationOptions['tabBarIcon']> = ({
  focused,
  size,
}) => <IconSearch color={tabBarIconColor(focused)} size={size} />;

const mainTabBarIconBookmark: NonNullable<BottomTabNavigationOptions['tabBarIcon']> = ({
  focused,
  size,
}) => <IconBookmark color={tabBarIconColor(focused)} size={size} />;

const mainTabBarIconPerson: NonNullable<BottomTabNavigationOptions['tabBarIcon']> = ({
  focused,
  size,
}) => <IconPerson color={tabBarIconColor(focused)} size={size} />;

/**
 * Bottom tab labels — `Inter_500Medium` + numeric `fontWeight` can render **blank** on some Android
 * devices; keep the Medium face via `fontFamily` and use `fontWeight: 'normal'`.
 */
const mainTabBarLabelStyle: NonNullable<BottomTabNavigationOptions['tabBarLabelStyle']> = {
  ...typography['tab-label'],
  fontWeight: 'normal',
  lineHeight: layout.tabBadgeLineHeight,
  marginTop: spacing.xs,
};

/** Watchlist tab count badge — PSD-Watchlist §6 / §7 W3 (`primary_container` fill). */
const watchlistTabBadgeStyles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary_container,
    color: colors.on_primary_container,
    ...typography['label-sm'],
    fontWeight: '700',
    lineHeight: layout.tabBadgeLineHeight,
    minWidth: layout.skeletonLineMd,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  },
});

function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { count, hydrated } = useWatchlistStore(
    useShallow((s) => ({ count: s.count, hydrated: s.hydrated })),
  );

  const watchlistBadge =
    hydrated && count > 0 ? (count > 99 ? '99+' : String(count)) : undefined;

  /**
   * `resources/home.html` BottomNavBar: `rounded-t-lg`, `px-6`, top pad tightened vs `pt-4`, `pb-8`; upward shadow.
   * Bottom padding is **`max(safe-area, pb-8)`** — not safe-area **plus** `pb-8` (that doubled height).
   */
  const mainTabScreenOptions = useMemo((): BottomTabNavigationOptions => {
    /**
     * Same baseline as `@react-navigation/bottom-tabs` `getPaddingBottom` (used only for the max
     * with design padding). Explicit **`height`** must equal content row + vertical paddings.
     */
    const libraryInsetBottom = Math.max(
      insets.bottom - (Platform.OS === 'ios' ? spacing.xs : fill.none),
      fill.none,
    );
    /** ~½ of `home.html` `pt-4` (16px → 8px) — tighter icon row under the bar’s top edge. */
    const designTopPad = spacing.sm;
    /** `home.html` `pb-8` (32px) — single bottom rhythm vs home indicator, whichever is larger. */
    const designBottomMin = spacing.xxl;
    const paddingBottom = Math.max(libraryInsetBottom, designBottomMin);
    const tabBarInnerHeight = layout.bottomTabContentHeight + designTopPad + paddingBottom;

    return {
      headerShown: false,
      tabBarActiveTintColor,
      tabBarInactiveTintColor,
      tabBarBackground: renderTabBarGlassBackground,
      tabBarIconStyle: {
        marginBottom: fill.none,
      },
      tabBarItemStyle: {
        paddingVertical: fill.none,
      },
      tabBarLabelStyle: mainTabBarLabelStyle,
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopLeftRadius: radiusCardInner,
        borderTopRightRadius: radiusCardInner,
        borderTopWidth: fill.none,
        height: tabBarInnerHeight,
        overflow: 'hidden',
        paddingBottom,
        paddingHorizontal: Math.max(spacing.xl, insets.left, insets.right),
        paddingTop: designTopPad,
        ...(Platform.OS === 'ios'
          ? {
              shadowColor: colors.surface_container_lowest,
              shadowOffset: { height: -spacing.xs, width: fill.none },
              shadowOpacity: opacity.muted,
              shadowRadius: layout.tabBarShadowRadius,
            }
          : {
              elevation: elevation.screen,
            }),
      },
    };
  }, [insets.bottom, insets.left, insets.right]);

  return (
    <Tab.Navigator screenOptions={mainTabScreenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: mainTabBarIconHome,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          tabBarIcon: mainTabBarIconSearch,
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistStackNavigator}
        options={{
          tabBarIcon: mainTabBarIconBookmark,
          tabBarLabel: 'Watchlist',
          tabBarBadge: watchlistBadge,
          tabBarBadgeStyle: watchlistTabBadgeStyles.badge,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: mainTabBarIconPerson,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={stackScreenOptions}>
      <RootStack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          headerShown: false,
          title: 'Detail',
          /**
           * Android default stack transition can briefly show the tab (Home) under the incoming
           * card. `slide_from_right` is Android-specific in react-native-screens; iOS keeps default.
           */
          animation: 'slide_from_right',
        }}
      />
      <RootStack.Screen
        name="SeeAll"
        component={SeeAllScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            ...typography['title-lg'],
            color: colors.on_surface,
          },
        })}
      />
    </RootStack.Navigator>
  );
}
