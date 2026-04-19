/**
 * @format
 * Links Manrope + Inter TTFs from `@react-native-google-fonts/*` (npm aliases → `@expo-google-fonts/*`)
 * into native projects (PSD §3 / §6.2). After changing this list, run: `npx react-native-asset`
 */
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: [
    './node_modules/@react-native-google-fonts/manrope/Manrope_600SemiBold.ttf',
    './node_modules/@react-native-google-fonts/manrope/Manrope_700Bold.ttf',
    './node_modules/@react-native-google-fonts/manrope/Manrope_800ExtraBold.ttf',
    './node_modules/@react-native-google-fonts/inter/Inter_400Regular.ttf',
    './node_modules/@react-native-google-fonts/inter/Inter_500Medium.ttf',
    './node_modules/@react-native-google-fonts/inter/Inter_600SemiBold.ttf',
    './node_modules/@react-native-google-fonts/inter/Inter_700Bold.ttf',
  ],
};
