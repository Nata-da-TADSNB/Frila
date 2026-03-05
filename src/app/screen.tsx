import { View, StyleSheet, ViewProps } from "react-native";

type ScreenProps = ViewProps & {
  noPadding?: boolean;
  noPaddingHorizontal?: boolean;
  noPaddingTop?: boolean;
};

export default function Screen({
  children,
  style,
  noPadding,
  noPaddingHorizontal,
  noPaddingTop,
  ...rest
}: ScreenProps) {

  return (
    <View
      style={[
        styles.container,
        noPadding && styles.noPadding,
        noPaddingHorizontal && styles.noPaddingHorizontal,
        noPaddingTop && styles.noPaddingTop,
        style
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  noPadding: {
    padding: 0,
  },

  noPaddingHorizontal: {
    paddingHorizontal: 0,
  },

  noPaddingTop: {
    paddingTop: 0,
  },
});