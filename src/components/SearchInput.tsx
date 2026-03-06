import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";

type Props = {
    placeholder?: string;
};

export function SearchInput({ placeholder }: Props) {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                style={styles.input}
            />
            <Ionicons name="search" size={20} color={colors.preto} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: colors.creme,
        borderRadius: 30,
        width: "60%",
        padding: 15,
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
    },

    input: {
        fontSize: 16,
        flex: 1,
        width: "50%",
        borderRadius: 20,
    }
});