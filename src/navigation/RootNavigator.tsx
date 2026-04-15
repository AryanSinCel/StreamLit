import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
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
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
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
      <HomeStack.Screen
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
      <SearchStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false, title: 'Detail' }}
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
      <WatchlistStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false, title: 'Detail' }}
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

const tabBarActiveTintColor = colors.brand_coral;
const tabBarInactiveTintColor = colors.tab_icon_inactive;

function tabBarIconColor(focused: boolean): string {
  return focused ? colors.brand_coral : colors.tab_icon_inactive;
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

/** Watchlist tab count badge — PSD-Watchlist §6 / §7 W3 (`primary_container` fill). */
const watchlistTabBadgeStyles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary_container,
    color: colors.on_primary_container,
    ...typography['label-sm'],
    fontWeight: '700',
    lineHeight: 16,
    minWidth: 18,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  },
});

function MainTabNavigator() {
  const { count, hydrated } = useWatchlistStore(
    useShallow((s) => ({ count: s.count, hydrated: s.hydrated })),
  );

  const watchlistBadge =
    hydrated && count > 0 ? (count > 99 ? '99+' : String(count)) : undefined;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarLabelStyle: {
          ...typography['tab-label'],
          marginTop: spacing.xs,
        },
        tabBarStyle: {
          backgroundColor: colors.tab_bar_scrim,
          borderTopWidth: 0,
          paddingBottom: spacing.xxl,
          paddingTop: spacing.md,
        },
      }}
    >
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
        options={{ headerShown: false, title: 'Detail' }}
      />
    </RootStack.Navigator>
  );
}
