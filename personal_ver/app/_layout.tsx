import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { 
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold
} from '@expo-google-fonts/plus-jakarta-sans';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserStore } from '@/utils/store';
import { useAuthStore } from '@/stores/authStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [loaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });

  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const [isMounted, setIsMounted] = useState(false);
  
  const segments = useSegments();
  const router = useRouter();

  // Fire auth hydration globally on startup
  const loadToken = useAuthStore((state) => state.loadToken);

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (loaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, hasHydrated]);

  useEffect(() => {
    if (!isMounted || !loaded || !hasHydrated) return;

    const inOnboardingGroup = segments[0] === 'onboarding';
    const inAuthGroup = segments[0] === 'auth';

    if (hasCompletedOnboarding && inOnboardingGroup) {
      router.replace('/(tabs)');
    } else if (!hasCompletedOnboarding && !inOnboardingGroup && !inAuthGroup) {
      router.replace('/onboarding');
    }
  }, [isMounted, loaded, hasHydrated, hasCompletedOnboarding, segments]);

  if (!loaded || !isMounted || !hasHydrated) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/register" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/login" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
