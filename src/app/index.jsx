import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('userId').then(userId => {
      router.replace(userId ? '/home' : '/login');
    });
  }, []);

  return <View style={{ flex: 1 }} />;
}
