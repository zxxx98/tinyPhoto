import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

const theme = {
  light: {
    mode: 'light',
    colors: {
      primary: '#2089dc',
      secondary: '#ca71eb',
      background: '#ffffff',
      white: '#ffffff',
      black: '#242424',
      grey0: '#393e42',
      grey1: '#43484d',
      grey2: '#5e6977',
      grey3: '#86939e',
      grey4: '#bdc6cf',
      grey5: '#e1e8ee',
      greyOutline: '#bbb',
      success: '#52c41a',
      error: '#ff190c',
      warning: '#faad14',
      disabled: 'hsl(208, 8%, 90%)',
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      primary: '#439ce0',
      secondary: '#aa49eb',
      background: '#000000',
      white: '#080808',
      black: '#f2f2f2',
      grey0: '#e1e8ee',
      grey1: '#bdc6cf',
      grey2: '#86939e',
      grey3: '#5e6977',
      grey4: '#43484d',
      grey5: '#393e42',
      greyOutline: '#bbb',
      success: '#439946',
      error: '#bf2c24',
      warning: '#cfbe27',
      disabled: 'hsl(208, 8%, 90%)',
    },
  },
} as const;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <RNEThemeProvider theme={currentTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </RNEThemeProvider>
  );
}
