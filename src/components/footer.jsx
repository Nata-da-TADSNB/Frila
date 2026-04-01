import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export function Footer() {

    const router = useRouter();

    return (
        <View style={styles.wrapper}>

            <Pressable style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={28} color="white" 
                    onPress={() => router.push("/gostei")}
                />
            </Pressable>

            <View style={styles.container}>

                <Pressable>
                    <Ionicons name="home-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/home")}
                    />
                </Pressable>

                <Pressable>
                    <Ionicons name="chatbubble-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/chat")}
                    />
                </Pressable>

                <View style={{ width: 40 }} />

                <Pressable>
                    <Ionicons name="document-text-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/pedidos")}
                    />
                </Pressable>

                <Pressable>
                    <Ionicons name="person-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/perfil")}
                    />
                </Pressable>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    wrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignItems: "center",
    },

    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: 75,
        borderWidth: 1,
        borderColor: colors.marromClaro,
        backgroundColor: colors.creme,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    favoriteButton: {
        position: "absolute",
        top: -20,
        backgroundColor: colors.rosa,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },

});