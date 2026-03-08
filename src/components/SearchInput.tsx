import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import colors from "@/constants/Colors";
import { router, useRouter } from "expo-router";


type Props = {
    placeholder?: string;
};

export function SearchInput({ placeholder }: Props) {
    return (
        <BlurView intensity={60} tint="light" style={styles.container} >
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={colors.cinza}
                style={styles.input}
            />
            <Ionicons
            name="search" 
            size={20} 
            color={colors.preto}
            onPress={() => router.push("/search")}
            />
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 30,
        width: "60%",
        padding: 15,
        overflow: "hidden",

        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
    },

    input: {
        fontSize: 16,
        flex: 1,
        width: "50%",
        borderRadius: 20,
    }
});