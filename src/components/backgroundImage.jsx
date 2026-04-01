import { ImageBackground, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Background({ children, source }) {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />

      <ImageBackground
        source={source}
        resizeMode="cover"
        style={styles.container}
      >
        {children}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});