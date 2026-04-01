import { View, StyleSheet } from "react-native";

export default function Screen({
  children,
  style,
  noPadding,
  noPaddingHorizontal,
  noPaddingTop,
  ...rest
}) {

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
    paddingHorizontal: 20,
    paddingTop: 30,
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