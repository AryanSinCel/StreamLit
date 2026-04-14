/**
 * MovieList — single app root (Task 9): gesture root → safe area → navigation.
 */

import { NavigationContainer } from '@react-navigation/native';
import type { JSX } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar
            backgroundColor={Platform.OS === 'android' ? colors.surface : undefined}
            barStyle="light-content"
            translucent={Platform.OS === 'android' ? false : undefined}
          />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
