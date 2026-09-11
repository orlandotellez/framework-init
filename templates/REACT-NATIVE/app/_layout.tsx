import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/src/shared/lib';

type RootRoutes = "(tabs)"

interface StackConfig {
  name: RootRoutes;
  headerShown: boolean;
  title?: string;
  presentation?: 'modal' | 'card' | 'fullScreenModal';
}

const ROOT_STACK: StackConfig[] = [
  {
    name: "(tabs)",
    headerShown: false
  },
];

// Barra de navegacion nativa con iconos oscuros
useEffect(() => {
  if (Platform.OS !== 'android') return
  NavigationBar.setButtonStyleAsync('dark')
})

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.secondary }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={colors.background}
            translucent={false}
          />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.secondary },
              animation: 'none'
            }}
          >
            {ROOT_STACK.map((route) => (
              <Stack.Screen
                key={route.name}
                name={route.name}
                options={{
                  headerShown: route.headerShown,
                  title: route.title,
                  presentation: route.presentation,
                }}
              />
            ))}
          </Stack>
        </View>
      </SafeAreaProvider>
    </>
  );
}
