import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export function Footer() {
    const router = useRouter();

    return (
        <View style={styles.wrapper}>
            <Pressable
                style={styles.favoriteButton}
                onPress={() => router.push("/cadastrarServico")}
            >
                <Ionicons name="add" size={32} color="white" />
            </Pressable>

            <View style={styles.container}>
                <Pressable onPress={() => router.push("/home")}>
                    <Ionicons name="home-outline" size={24} color={colors.marromClaro} />
                </Pressable>

                <Pressable onPress={() => router.push("/chat")}>
                    <Ionicons name="chatbubble-outline" size={24} color={colors.marromClaro} />
                </Pressable>

                <View style={{ width: 40 }} />

                <Pressable onPress={() => router.push("/meuServicos")}>
                    <Ionicons name="briefcase-outline" size={24} color={colors.marromClaro} />
                </Pressable>

                <Pressable onPress={() => router.push("/perfil")}>
                    <Ionicons name="person-outline" size={24} color={colors.marromClaro} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 1000,
    },

    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: 70,
        borderWidth: 1,
        borderColor: colors.marromClaro,
        backgroundColor: colors.creme,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    favoriteButton: {
        position: "absolute",
        top: -20,
        backgroundColor: colors.cinza,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1001,
    },
});