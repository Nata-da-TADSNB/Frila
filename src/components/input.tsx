import { StyleSheet, TextInput, TextInputProps } from "react-native";
import colors from "@/constants/Colors";


export function Input(props: TextInputProps) {
  return <TextInput  style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    fontSize: 20,
    borderRadius: 20,
    padding: 15,
    backgroundColor: colors.creme,
  },
});