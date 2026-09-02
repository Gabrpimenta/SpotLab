import "react-native-reanimated";

import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";

import { LaunchSplash } from "@/src/components/game/LaunchSplash";
import { colors } from "@/src/design-system/colors";
import { AppProviders } from "@/src/providers/AppProviders";

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 260, fade: true });

const spotLabTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.accent,
  },
};

export default function RootLayout() {
  const [showLaunch, setShowLaunch] = useState(true);
  const finishLaunch = useCallback(() => setShowLaunch(false), []);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <AppProviders>
      <ThemeProvider value={spotLabTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            animation: "slide_from_right",
            animationMatchesGesture: true,
            fullScreenGestureEnabled: true,
            gestureDirection: "horizontal",
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="trainer/[spotId]"
            options={{ headerShown: false }}
          />
        </Stack>
        {showLaunch ? <LaunchSplash onFinish={finishLaunch} /> : null}
      </ThemeProvider>
    </AppProviders>
  );
}
