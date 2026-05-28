import { initDatabase } from "@/database/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = new Set(['login', 'cadastro']);

export default function Layout() {
  const [fontsLoaded] = useFonts({
    GotuRegular: require("@/assets/fonts/Gotu-Regular.ttf"),
    KohoLight: require("@/assets/fonts/KoHo-Light.ttf"),
    KohoRegular: require("@/assets/fonts/KoHo-Regular.ttf"),
    KohoMedium: require("@/assets/fonts/KoHo-Medium.ttf"),
    KohoBold: require("@/assets/fonts/KoHo-Bold.ttf"),
  });

  const router = useRouter();
  const segments = useSegments();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch(err => console.error('DB init error:', err));
  }, []);

  useEffect(() => {
    if (!dbReady) return;

    async function guard() {
      const userId = await AsyncStorage.getItem('userId');
      const route = segments[0] ?? '';
      if (!userId && !PUBLIC_ROUTES.has(route)) {
        router.replace('/login');
      }
    }
    guard();
  }, [dbReady, segments]);

  if (!fontsLoaded || !dbReady) return null;

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
