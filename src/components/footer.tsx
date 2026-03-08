import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/Colors";
import { useRouter } from "expo-router";

export function Footer() {

    const router = useRouter();

    return (
        <View style={styles.wrapper}>

            <Pressable style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={28} color="white" />
            </Pressable>

            <View style={styles.container}>

                <Pressable>
                    <Ionicons name="home-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/home")}
                    />
                </Pressable>

                <Pressable>
                    <Ionicons name="chatbubble-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/search")}
                    />
                </Pressable>

                {/* espaço para botão central */}
                <View style={{ width: 40 }} />

                <Pressable>
                    <Ionicons name="document-text-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/search")}
                    />
                </Pressable>

                <Pressable>
                    <Ionicons name="person-outline" size={24} color={colors.marromClaro}
                        onPress={() => router.push("/login")}
                    />
                </Pressable>

            </View>[]

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
        backgroundColor: colors.marrom,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },

});