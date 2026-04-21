import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { spacing } from '../theme/spacing';

/**
 * Bottom padding for tab-root **`ScrollView` / `FlatList`** when the tab bar uses
 * **`position: 'absolute'`** so frosted **`BlurView`** samples real content behind the bar.
 */
export function useTabScreenScrollBottomPadding(): number {
  return useBottomTabBarHeight() + spacing.xxxxl;
}
