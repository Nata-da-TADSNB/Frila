import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function Layout() {

  const [fontsLoaded] = useFonts({
    GotuRegular: require("@/assets/fonts/Gotu-Regular.ttf"),
    KohoLight: require("@/assets/fonts/KoHo-Light.ttf"),
    KohoRegular: require("@/assets/fonts/KoHo-Regular.ttf"),
    KohoMedium: require("@/assets/fonts/KoHo-Medium.ttf"),
    KohoBold: require("@/assets/fonts/KoHo-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}