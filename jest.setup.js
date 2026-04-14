/**
 * Jest — native modules that are not available in the Node test environment.
 *
 * @format
 */
/* eslint-env jest */

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
  };
});
