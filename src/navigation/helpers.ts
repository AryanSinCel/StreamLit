/**
 * Typed navigates to root-stack routes (`Detail`, `SeeAll`) — reduces repeated `navigation.navigate` noise in screens.
 *
 * Accepts **`NavigationProp<ParamListBase>`** so tab / nested stacks (composite props) can pass **`navigation`** without cast.
 */

import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { RootStackParamList, SeeAllParams } from './types';

export function navigateToDetail(
  navigation: NavigationProp<ParamListBase>,
  movieId: number,
): void {
  const nav = navigation as NavigationProp<RootStackParamList>;
  nav.navigate('Detail', { movieId });
}

export function navigateToSeeAll(
  navigation: NavigationProp<ParamListBase>,
  params: SeeAllParams,
): void {
  const nav = navigation as NavigationProp<RootStackParamList>;
  nav.navigate('SeeAll', params);
}
