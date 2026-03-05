import { StyleSheet, TextInput } from "react-native"
import colors from "@/constants/Colors";

export function Input() {
    return <TextInput style={styles.input} />

}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        fontSize: 20,
        borderRadius: 20,
        padding: 15,
        boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.25)",
    }
})