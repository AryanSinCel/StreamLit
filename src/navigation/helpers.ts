/**
 * Pushes root-stack screens (`Detail`, `SeeAll`) so **back** pops one screen at a time.
 * Use **`StackActions.push`** (not **`navigate`**) — the latter reuses a single `Detail` entry and
 * only updates params, so one `goBack()` can skip the previous screen (e.g. See All under Detail).
 *
 * Resolves the **root** stack via **`getParent()`** so nested tab / per-tab stacks dispatch correctly.
 */

import { StackActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import type { RootStackParamList, SeeAllParams } from './types';

function getRootStackNavigation(
  navigation: NavigationProp<ParamListBase>,
): NavigationProp<RootStackParamList> {
  let current: NavigationProp<ParamListBase> = navigation;
  for (;;) {
    const parent: NavigationProp<ParamListBase> | undefined = current.getParent();
    if (parent == null) {
      return current as NavigationProp<RootStackParamList>;
    }
    current = parent;
  }
}

export function navigateToDetail(
  navigation: NavigationProp<ParamListBase>,
  movieId: number,
): void {
  getRootStackNavigation(navigation).dispatch(StackActions.push('Detail', { movieId }));
}

export function navigateToSeeAll(
  navigation: NavigationProp<ParamListBase>,
  params: SeeAllParams,
): void {
  getRootStackNavigation(navigation).dispatch(StackActions.push('SeeAll', params));
}
