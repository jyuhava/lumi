import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { getToken } from "../api/axios";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "login",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        const inAuthGroup = segments[0] === "(tabs)";
        
        if (!token && inAuthGroup) {
          setTimeout(() => router.replace("/login"), 10);
        } else if (token && segments[0] === "login") {
          setTimeout(() => router.replace("/(tabs)"), 10);
        }
      } catch (e) {
        if (segments[0] === "(tabs)") {
          setTimeout(() => router.replace("/login"), 10);
        }
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}