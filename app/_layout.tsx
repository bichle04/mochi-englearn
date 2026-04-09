import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import {
  WorkSans_400Regular,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import {
  Lexend_400Regular,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    WorkSans_400Regular,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <CourseProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="speaking" options={{ headerShown: false }} />
            <Stack.Screen name="statistics" options={{ headerShown: false }} />
            <Stack.Screen name="statistic/history" options={{ headerShown: false }} />
            <Stack.Screen name="statistic/vocabulary" options={{ headerShown: false }} />
            <Stack.Screen name="statistic/achievements" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="loading" options={{ headerShown: false }} />
          </Stack>
        </CourseProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
