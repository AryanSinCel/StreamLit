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

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Passthrough = ({ children, ...rest }) =>
    React.createElement(View, rest, children);
  return {
    __esModule: true,
    default: Passthrough,
    Svg: Passthrough,
    Path: View,
    Circle: View,
    Rect: View,
    G: View,
    Defs: View,
    LinearGradient: View,
    Stop: View,
    Polygon: View,
    Polyline: View,
    Line: View,
    Ellipse: View,
    Text: View,
    TSpan: View,
    Use: View,
    Symbol: View,
    Mask: View,
    ClipPath: View,
    Image: View,
    ForeignObject: View,
  };
});
