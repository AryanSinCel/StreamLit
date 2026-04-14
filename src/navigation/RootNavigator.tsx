import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
        options={({ route }) => ({ title: route.params.title })}
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
        options={{ title: 'Detail' }}
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
        options={{ title: 'Watchlist' }}
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
        options={{ title: 'Profile' }}
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

function MainTabNavigator() {
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
        options={{ title: 'Detail' }}
      />
    </RootStack.Navigator>
  );
}
