import { ImageBackground, StyleSheet, ImageSourcePropType } from "react-native";
import { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";

type Props = {
  children: ReactNode;
  source: ImageSourcePropType;
};

export default function Background({ children, source }: Props) {
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